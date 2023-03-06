const passport = require('passport');
const express = require('express');
const Router = require('express').Router;
const axios = require('axios');
const router = express.Router();
const { Interface } = require('readline');
require('dotenv').config();
const {addservice_copy} = require('../controllers/userController');
const SCOPES = ["user-read-currently-playing", "user-read-playback-state", "user-modify-playback-state", "playlist-modify-private"]
const SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');
const { get } = require('http');
const actual_device = '';
let devices = [];

var tentative_refresh = 2;

const GetcurrentSong = async (token, user, service_id) => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${token[0]}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    let artists = [];
    if (response.data === '') {
      console.log("No song playing");
      return {"status": "fail"};
    }
    for (let i = 0; i < response.data.item.artists.length; i++) {
      artists.push(response.data.item.artists[i].name);
    }
    tentative_refresh = 2;
    return {"status": "success", "song_name": response.data.item.name, "artist_name": artists, "album_name": response.data.item.album.name};
  }).catch((error) => {
    if (error && error.response && error.response.status == 401 && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      GetcurrentSong(token, user, service_id);
    }
    if (error.response.status == 401) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error"};
  });
  return data;
}

const ImListeningASong = async (args, Token, user, service_id) => {
  const Song = await GetcurrentSong(Token, user, service_id);
  if (Song.status === "error") {
    return {"status": "error"};
  } else if (Song.status === "fail") {
    return {"status": "fail"};
  }
  if (Song.song_name.toLowerCase() == args[0].toLowerCase()) {
    for (let i = 0; i < Song.artist_name.length; i++) {
      if (Song.artist_name[i].toLowerCase() == args[1].toLowerCase()) {
        console.log("Is this song")
        return {"status": "success"};
      }
    }
  }
  return {"status": "fail"};
}

const is_artist = (artist_name, artists_list) => {
  for (let i = 0; i < artists_list.length; i++) {
    if (artist_name.toLowerCase() == artists_list[i].name.toLowerCase()) {
      return true;
    }
  }
  return false;
}

const searchArtist = async (args, token, user, service_id) => {
  const data = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token[0]}`
    },
    params: {
      q: args[0],
      type: 'track',
      market: 'FR',
      limit: 5
    }
  }).then((response) => {
    for (let i = 0; i < response.data.tracks.items.length; i++) {
      if (response.data.tracks.items[i].name.toLowerCase() == args[0].toLowerCase() && is_artist(args[1], response.data.tracks.items[i].artists)) {
        return {"track_uri": response.data.tracks.items[i].uri, "status": "success"};
      }
    }
    console.log("No song found");
    tentative_refresh = 2;
    return {"status": "fail"};
  }).catch((error) => {
    if (error && error.response && error.response.status == 401 && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      searchArtist(args, token, user, service_id);
    }
    if (error.response.status == 401) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error"};
  });
  return data;
}

const GetDevices = async (token, user, service_id) => {
  const data = await axios.get('https://api.spotify.com/v1/me/player/devices', {
    headers: {  
      Authorization: `Bearer ${token[0]}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (response.data.devices.length == 0) {
      return {"status": "fail"};
    }
    for (let i = 0; i < response.data.devices.length; i++) {
      if (response.data.devices[i].is_active == true) {
        return {"actual_device": response.data.devices[i].id, "status": "success"};
      }
    }
    tentative_refresh = 2;
    return {"status": "fail"};
  }).catch((error) => {
    if (error && error.response && error.response.status == 401 && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      GetDevices(token, user, service_id);
    }
    if (error.response.status == 401) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error"};
  });
  return data;
}

const ChangeSong = async (args, token, user, service_id) => {
  var uri = await searchArtist(args, token, user, service_id);
  var device = await GetDevices(token, user, service_id);
  if (device.status == "error" || uri.status == "error") {
    return {"status": "error"};
  }
  if (device.status == "fail" || uri.status == "fail") {
    return {"status": "fail"};
  }
  const data = await axios.put('https://api.spotify.com/v1/me/player/play?device_id=' + device.actual_device,
    {
      uris: [uri.track_uri]
    },
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token[0]}`,
        'Content-Type': 'application/json'
      },
    }
  ).then((response) => {
    tentative_refresh = 2;
    console.log("Song changed");
    return {"status": "success"};
  }).catch((error) => {
    console.log(error);
    if (error.response.status == 401 && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      ChangeSong(args, token, user, service_id);
    }
    if (error.response.status == 401) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error"};
  });
  return data;
}

const AddSongToPlaylist = async (args, token, user, service_id) => {
  const playlist = await SearchPlaylist(args, token, user, service_id);
  const track = await searchArtist(args, token, user, service_id);
  if (playlist.status == "error" || track.status == "error") {
    return {"status": "error"};
  }
  if (playlist.status == "fail" || track.status == "fail") {
    return {"status": "fail"};
  }
  const data = await axios.post('https://api.spotify.com/v1/playlists/' + playlist.playlist_id + '/tracks', {
    uris: [track.track_uri]
  }, 
  {
    headers: {
      Authorization: `Bearer ${token[0]}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    tentative_refresh = 2;
    console.log("Song added to playlist");
    return {"status": "success"};
  }).catch((error) => {
    console.log(error);
    return {"code_error": error.response.data.error.status};
  });
}

const GetUser = async (token, user, service_id) => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token[0]}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    tentative_refresh = 2;
    return {"status": "success", "data": response.data};
  }).catch((error) => {
    console.log(tentative_refresh)
    if (error.response.status == 401 && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          console.log("new token:" + accessToken);
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      GetUser(token, user, service_id);
    }
    if (error && error.response && error.response.status == 401 && tentative_refresh == 0) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    return {"status": "error"};
  });
  return response;
}

const CreatePlaylist = async (args, token, user, service_id) => {
  var _user = await GetUser(token);
  if (_user.status == "error") {
    return {"status": "error"};
  }
  const data = await axios.post('https://api.spotify.com/v1/users/' + _user.data.id + '/playlists', {
    name: args[2],
    description: args[2],
    public: false
  },
  {
    headers: {
      Authorization: `Bearer ${token[0]}`,
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    tentative_refresh = 2;
    console.log("Playlist created");
    return {"playlist_id": response.data.id, "status": "success"};
  }).catch((error) => {
    console.log(error.message);
    if ((error.response.status == 401 || error.response.status == 403) && tentative_refresh > 0) {
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      CreatePlaylist(args, token, user, service_id);
    }
    if ((error.response.status == 401 || error.response.status == 403) && tentative_refresh > 0) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error", "msg": error};
  });
  return data;
}

const SearchPlaylist = async (args, token, user, service_id) => {
  const data = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${token[0]}`
    },
    query: {
      limit: 50
    }
  }).then((response) => {
    for (let i = 0; i < response.data.items.length; i++) {
      if (response.data.items[i].name == args[2]) {
        return {"playlist_id": response.data.items[i].id, "status": "success"};
      }
    }
    tentative_refresh = 2;
    console.log("Playlist not found");
    return CreatePlaylist(args, token, user, service_id);
  }).catch((error) => {
    if (error.response.status == 401 && tentative_refresh > 0) {
      console.log("token expired");
      tentative_refresh--;
      refresh.requestNewAccessToken('spotify', token[1], (err, accessToken, refreshToken) => {
        if (err) {
          console.log(err);
          return { "status": "error" }
        } else {
          for (var i = 0; i < user.services.length; i++) {
            if (user.services[i]._id == service_id.toString()) {
              user.services[i].access_token = accessToken;
              user.save();
            }
          }
        }
      });
      SearchPlaylist(args, token, user, service_id);
    }
    if (error.response.status == 401 && tentative_refresh == 0) {
      console.log("token expired please reconnect");
      return { "status": "error" }
    }
    tentative_refresh = 2;
    return {"status": "error"};
  });
  return data;
}

passport.serializeUser(function (user, done) {
  done(null, user);
});
  
passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

const strategy = new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/service/spotify/auth/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, expires_in, profile, done) {
    return done(null, {accessToken, refreshToken, expires_in, profile});
  }
)

passport.use(strategy);
refresh.use(strategy);

const SpotifyAuth = async (req, res, next) => {
  passport.authenticate('spotify', {scope: SCOPES, showDialog: true, state: "token=" + req.query.token + ",serviceid=" + req.query.service_id})(req, res, next);
}

router.get('/auth', SpotifyAuth);

router.get('/auth/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  async function (req, res) {
    const user_id = req.query.state.split(",")[0].split("=")[1];
    const service_id = req.query.state.split(",")[1].split("=")[1];
    response = await addservice_copy(user_id, service_id, req.user.accessToken, req.user.refreshToken, null);
    if (response.status != 200) {
      console.log("error");
      console.log(response.message)
    }
    console.log("service added");
    res.redirect('http://localhost:8081/home');
    return req.user.accessToken;
  }
);

// router.get('/test_spotify_actions', async function(req, res) {
//   for (let i = 0; i < actions.length; i++) {
//     if (actions[i][req.body.action_id]) {
//       const data = await actions[i][req.body.action_id](req.body.args, req.body.token);
//       res.json(data);
//     }
//   }
// })

// router.get('/get_devices', async function(req, res) {
//   const data = await my_spotify.GetDevices();
//   res.json(data);
// });

// router.get('/change_song', function(req, res) {
//   my_spotify.changeSong(reaction).then((data) => {
//     res.json(data);
//     console.log(data);
//   }).catch((error) => {
//     res.json(error);
//     console.log(error);
//   });
// });

module.exports = {router, AddSongToPlaylist, ImListeningASong, ChangeSong};