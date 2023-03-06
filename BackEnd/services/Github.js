var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
const fetch = require("node-fetch");
const { raw } = require('express');
const { use } = require('passport');
const app = express();
const {addservice_copy} = require('../controllers/userController');
const axios = require('axios');
const router = express.Router();

app.use(session({ secret: 'SECRET', resave: true,
saveUninitialized: true}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/service/github/auth/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    return done(null, {accessToken, refreshToken, profile});
  }
));

const github_auth = async (req, res, next) => {
  const GITHUB_SCOPES = [ 'user:email', 'public_repo', 'repo', 'read:user', 'user:follow' ];
  passport.authenticate('github', {scope: GITHUB_SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next); 
}

router.get('/auth', github_auth);

router.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async function(req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("Github service added");
    res.redirect('http://localhost:8081/home');
  });

    const fork_repo = async (args, token, user, service_action_id) =>
    {
      const body_json =
      {"name" : args[0]};
      //
      const rawResponse = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        },
        body : JSON.stringify(body_json)
      });
      const content = await rawResponse.json();
      return ({'status':'success'});
    }

    const follow_user = async(args, token, user, service_action_id) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + args[0], {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        }
      });
      return ({'status':'success'});
    }

    const unfollow_user = async (args, token, user, service_action_id) =>
    {
      const rawResponse = await fetch('https://api.github.com/user/following/' + args[0], {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token[0],
        }
      });
      return ({'status':'success'});
    }


    // check if i follow user
  const receive_following = async (args, token, user, service_id) => {
    const rawResponse = await axios.get('https://api.github.com/user/followers', {
      headers: {
        'Authorization': 'Bearer ' + token[0],
      }
    }).then((response) => {
      return (response)
    }).catch((error) => {
      console.log(error);
      return ({status: "error"});
    });
    if (rawResponse.status === 200) {
      for (var i = 0; i < rawResponse.data.length; i++) {
        if (rawResponse.data[i].login === args[0])
          return {status: "success"};
      }
    }
    return ({status: "fail"});
    // console.log(rawResponse);
    // const content = rawResponse;
    // console.log(content);
    // for (var i = 0; i != content.length; i++) {
    //   console.log(content[i]);
    //   if (content[i].login === args[0])
    //     return ({'status':'success'});
    // };
    // return ({'status':'fail'});
  }

const IsFollower = async (args, token, user, service_action_id) => {
  const data = await receive_following(args[0], token[0]);

}

const check_follower = async (args, token, user, service_id) =>{
  const rawResponse = await axios.get('https://api.github.com/user/following/' + args[0], {
    headers: {
      Authorization: 'Bearer ' + token[0],
    }
  }).then((response) => {
    return (response)
  }).catch((error) => {
    if (error.response.status === 404) {
      return {status: "fail"};
    } else {
      return {status: "error"};
    }
  });
  if (rawResponse && rawResponse.status === 204)
    return {status: "success"};
  else if (rawResponse && rawResponse.status === 404)
    return {status: "fail"};
}

const ImFollowing = async (req, res) => {
  const data = await check_follower(req.body.args[0]);
}

// router.get('/followers', IsFollower);

// router.get('/imfollowing', ImFollowing);


// // create a repo
//   router.get('/user/repos',
//   function(req, res){
//     fork_repo(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
//     res.redirect("/");
//     return res;
//   });

// // follow user
// router.get('/user/follow',
// function(req, res){
//   follow_user(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
//   res.redirect("/");
//   return res;
// });

// // unfollow user
// router.get('/user/unfollow',
// function(req, res){
//   unfollow_user(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
//   res.redirect("/");
//   return res;
// });

// //check if user is following
// router.get('/following/check',
// function(req, res){
//   check_follower(req.body.args[0], req.body.token).then(function(data) {console.log(data)});
//   res.redirect("/");
//   return res;
// });

module.exports = {router, check_follower, receive_following, fork_repo, follow_user, unfollow_user};