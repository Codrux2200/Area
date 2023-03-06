const passport = require('passport');
const Router = require('express').Router;
const axios = require('axios');
const { addservice_copy } = require('../controllers/userController');
const router = Router();
const TwitchStrategy = require("passport-twitch-new").Strategy;
const SCOPES = ["user:manage:whispers", "user:read:follows", "moderator:manage:announcements", "channel:manage:raids", "channel:read:subscriptions", "channel:read:goals"]
require('dotenv').config();

passport.use(
  new TwitchStrategy(
    {
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/service/twitch/auth/callback",
    scope: SCOPES,
    passreqToCallback: true
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, {accessToken, refreshToken});
    }
  )
);

UserIdFromName = async (token, username) => {
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users?login=' + username, {
    headers: {
      Authorization: "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
};

const twitchSubCount = async (args, token, user, service_action_id) => {
  subs = args[0]
  usertoken = token[0]
  self_id = token[2]
  try {
  const data = await axios.get('https://api.twitch.tv/helix/subscriptions?broadcaster_id=' + self_id,{
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.total >= subs) {
    console.log("Subscriber count reached")
    return {"status": "success"};
  } else {
   return {"status": "fail"};
  }
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

const twitchAnnouncement = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let self_id = token[2]
  let streamer = args[0]
  let msg = args[1]
  color = args[2] || "primary"
  let streamer_id = await UserIdFromName(usertoken, streamer)
  let body = {"message": msg, "color": color}
  try {
  const data = await axios.post('https://api.twitch.tv/helix/chat/announcements?broadcaster_id=' + streamer_id + "&moderator_id=" + self_id,  body, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  return {"status": "success"};
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

const twitchSoundtrackIs = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let streamer = args[0]
  let soundtrack = args[1]
  let streamer_id = await UserIdFromName(token[0], streamer)
  try {
  const data = await axios.get('https://api.twitch.tv/helix/soundtrack/current_track?broadcaster_id=' + streamer_id, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.data[0].track.title.toLowerCase() === soundtrack.toLowerCase()) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    if (err.response.status === 404) {
      console.log("channel isn't playing any soundtrack")
    } else {
      console.log(err.response.status)
    }
    return {"status": "error"};
  }
}

const twitchGoalReached = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let streamer = args[0]
  let percent = args[1]
  let goalType = args[2]
  let streamer_id = await UserIdFromName(token[0], streamer)
  try {
    const data = await axios.get('https://api.twitch.tv/helix/goals?broadcaster_id=' + streamer_id, {
      headers: {
        'Authorization': "Bearer " + usertoken,
        'Client-ID': process.env.TWITCH_CLIENT_ID
      }
    })
    infos = data.data.data.filter(element => element.type.toLowerCase() === goalType.toLowerCase())
    if (infos) {
      let goalpercent = infos[0].current_amount / infos[0].target_amount
      if (percent <= goalpercent) {
        return {"status": "success"};
      } else {
        return {"status": "fail"};
      }
    }
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

const twitchLastPlayedIs = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let streamer_id = await UserIdFromName(token[0], args[0])
  let gamename = args[1]
  try {
  const data = await axios.get('https://api.twitch.tv/helix/channels?broadcaster_id=' + streamer_id, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  if (data.data.data[0].game_name.toLowerCase() === gamename.toLowerCase()) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

const twitchWhisp = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let self_id = token[2]
  streamer = args[0]
  msg = args[1]
  let streamer_id = await UserIdFromName(usertoken, streamer)
  let body = {"message": msg }
  try {
  const data = await axios.post('https://api.twitch.tv/helix/whispers?from_user_id=' + self_id + "&to_user_id=" + streamer_id, body, {
    headers: {
      'Authorization': "Bearer " + usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    }}
  )
  return {"status": "success"};
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

GetUserId = async (req, res) => {
  if (!req.user.accessToken) {
    res.status(400).send("error: missing field")
  }
  let token = req.user.accessToken;
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users' , {
    headers: {
      'Authorization': "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err.response.status)
    return(err)
  }
};

GetUserIdFromName = async (req, res) => {
  let token = req.headers.authorization.split(' ')[1]
  try {
  const data = await axios.get('https://api.twitch.tv/helix/users?login='+ req.body.username, {
    headers: {
      Authorization: "Bearer " + token,
      'Client-ID': process.env.TWITCH_CLIENT_ID
    },
  },);
  return(data.data.data[0].id)
  } catch(err) {
    console.log(err.response.status)
    return(err)
  }
};

var twitchToken = ''

const TwitchAuth = async (req, res, next) => {
  passport.authenticate('twitch', {scope: SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next)
}

router.get('/auth', TwitchAuth)

router.get('/auth/callback',
  passport.authenticate('twitch', {failureRedirect: '/login'}),
  async function(req, res) {
    try {
      const user_id = req.query.state.split(",")[0].split("=")[1];
      const service_id = req.query.state.split(",")[1].split("=")[1];
      twitchToken = req.user.accessToken;
      twitchRefresh = req.user.refreshToken
      const response = await GetUserId(req, res).then(async (data) => {
      return await addservice_copy(user_id, service_id, twitchToken, twitchRefresh, data)
    }).catch((error) => {
      console.log(err.response.status)
      res.status(500).send("error: couldn't get user Id")
    });
    if (response.status != 200) {
      console.log("error: couldn't add service")
    }
    console.log("service added");
    res.redirect('http://localhost:8081/home');
    return req.user.accessToken;
  } catch (err) {
    console.log(err.response.status)
    res.status(500).send("error: couldn't add service")
  }
});

const anyIsStreaming = async (usertoken, user_id) => {
  try {
  const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ user_id, {
    headers: {
      Authorization: usertoken,
      'Client-ID': process.env.TWITCH_CLIENT_ID
  }});
  if (!data.data.data) {
    return {"status": "error"};
  }
  let vals = data.data.data
  const streamers = vals.filter(e => e.type === "live")
  if(streamers.length > 0) {
    return {"status": "success"};
  } else {
    return {"status": "fail"};
  }
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

const streamerIsStreaming = async (args, token, user, service_action_id) => {
  let usertoken = token[0]
  let self_id = token[2]
  let streamerName = args[0]
  try {
    const data = await axios.get("https://api.twitch.tv/helix/streams/followed?user_id="+ self_id, {
      headers: {
        Authorization: "Bearer " + usertoken,
        'Client-ID': process.env.TWITCH_CLIENT_ID
    }});
    if (!data.data.data) {
      return {"status": "error"};
    }
    let vals = data.data.data
    const streamer = vals.find(e => e.user_name.toLowerCase() === streamerName.toLowerCase())
    if(streamer && streamer.type === "live") {
      return {"status": "success"};
    } else {
      return {"status": "fail"};
    }
  } catch(err) {
    console.log(err.response.status)
    return {"status": "error"};
  }
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

module.exports = {router, streamerIsStreaming, twitchWhisp, twitchLastPlayedIs, twitchGoalReached, twitchSoundtrackIs, twitchAnnouncement, twitchSubCount };