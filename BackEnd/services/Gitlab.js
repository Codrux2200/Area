var express = require('express');
var passport = require('passport');
var GitLabStrategy = require('passport-gitlab2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
const axios = require('axios');
let gitlab;
const app = express();
const {addservice_copy} = require('../controllers/userController');

const router = express.Router();

app.use(session({
  secret: 'SECRET', resave: true,
  saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GitLabStrategy({
  clientID: process.env.GITLAB_CLIENT_ID,
  clientSecret: process.env.GITLAB_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/service/gitlab/auth/callback",
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    return done(null, {accessToken, refreshToken, profile});
  }
));

const gitlab_auth = async (req, res, next) => {
  const GITLAB_SCOPES = ['api'];
  passport.authenticate('gitlab', {scope: GITLAB_SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
}

router.get('/auth', gitlab_auth);

router.get('/auth/callback',
  passport.authenticate('gitlab', { failureRedirect: '/login'}),
  async function(req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    if (response.status != 200) {
      console.log("error");
      console.log(response)
      res.redirect('http://localhost:8081/home');
    }
    console.log("GitLab service added");
    res.redirect('http://localhost:8081/home');
  });

const get_project_owned_by_user = async (args, token, user, service_action_id) => {
  const res = await axios.get('https://gitlab.com/api/v4/users/' + args[0] + '/projects?custom_attributes[simple]=true', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token[0]}`,
    }
  }).then((response) => {
    // console.log(response.data);
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].name === args[1]) {
        console.log("project found");
        return {status: "success"};
      }
    }
    return {status: "fail"};
  }).catch((error) => {
    if (error.response.status === 404)
      console.log(error.response.data);
    return ({status: "error"});
  })
  return res;
}

const star_project = async (args, token, user, service_action_id) => {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + args[0] + '/star', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token[0]}`,
      }
    }).then((response) => {
      return response;
    }).catch((error) => {
      if (error.status === 401) {
        console.log("token expired");
      }
      return {status: "error"};
    });
    if (rawResponse.status === 304)
      return {status: "fail"};
    console.log("starred");
    return {status: "success"};
  }


  const unstar_project = async (args, token, user, service_action_id) => {
    const rawResponse = await fetch('https://gitlab.com/api/v4/projects/' + args[0] + '/unstar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token[0]}`,
      }
    }).then((response) => {
      return response;
    }).catch((error) => {
      if (error.status === 401) {
        console.log("token expired");
      }
      return {status: "error"};
    });
    if (rawResponse.status === 304)
      return {status: "fail"};
    console.log("unstarred");
    return {status: "success"};
  }

module.exports = { router, star_project, get_project_owned_by_user , unstar_project};