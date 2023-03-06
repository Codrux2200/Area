const express = require("express");
const app = express();
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var passport = require('passport');
var session = require('express-session');
const {addservice_copy} = require("../controllers/userController");
require('dotenv').config()
let LinkedIn;

router = express.Router();

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(session({ secret: 'SECRET' }));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8080/service/linkedin/auth/callback",
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    sessions : false,
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    return done(null, {accessToken, refreshToken, profile});
  }));

  const send_localisation = (args, token, user, service_id) => {
    console.log("compare:" + args[0].toLowerCase() + " " + token[2].toLowerCase());
    if (args[0].toLowerCase() == token[2].toLowerCase())
      return {status: "success"};
    return {status: "fail"};
  }

  const send_message = async (args, token, user, service_id) => {
    let  json_call = `{
      "author": "` + "urn:li:person:" + token[1] + `",
      "lifecycleState": "PUBLISHED",
      "specificContent": {
          "com.linkedin.ugc.ShareContent": {
              "shareCommentary": {
                  "text": "` + args[0] + `"
              },
              "shareMediaCategory": "NONE"
          }
      },
      "visibility": {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    }`;
    send_data(json_call, token[0]);
  }
 const send_data = async (json_call, accessToken) => {
  const rawResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
      body: json_call
    });
    const content = await rawResponse.json();
    if (content.message != null) {
      return {status: "success"};
    }
    return {status: "fail"};
  }

router.get('/linkedin/country', 
function(req, res){
  let location = LinkedIn.send_localisation();
  res.send(location);
});

router.get('/linkedin/send',
  function(req, res){
    LinkedIn.send_message(req.params["message"]);
    res.send("true");
  });

const LinkedinAuth = async (req, res, next) => {
  passport.authenticate('linkedin', {showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
};

router.get('/auth', LinkedinAuth);

router.get('/auth/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  async function(req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.profile.id, JSON.parse(req.user.profile._raw).firstName.preferredLocale.country);
    if (response.status != 200) {
      console.log("Error while adding service");
      console.log(response);
    }
    console.log("Service added");
    res.redirect('http://localhost:8081/home');
    return req.user.accessToken;
  })

module.exports = {router , send_localisation, send_message};
