require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 8080;
const userRoutes = require('./routes/users');
const serviceRoutes = require('./routes/services');
const actionRoutes = require('./routes/actions');
const reactionRoutes = require('./routes/reactions');
const areaRoutes = require('./routes/areas');
const about_jsonRoutes = require('./routes/about_json');
const cors = require("cors");
const app = express();
const passport = require('passport');
const session = require("express-session");
const twitchroutes = require("./services/Twitch").router;
const linkedinroutes = require("./services/Linkedin").router;
const spotifyroutes = require("./services/Spotify").router;
const googleroutes = require("./services/google").router;
const githubroutes = require("./services/Github").router;
const gitlabroutes = require("./services/Gitlab").router;
const areaexec = require("./Areas/executeAreas");

app.use(cors());
app.use(express.json());

app.use(
//    session({
//      secret: "testsecretexperes",
//      resave: true,
//      saveUnitialized: true
//  })
//)

//app.use(passport.initialize());
//app.use(cors({
//  origin:"http://localhost:8080",
//  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//  credentials: true
//  })
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// connect to MongoDB
connectDB();

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
})

areaexec.job.start();

app.use('/', about_jsonRoutes);

app.use('/', userRoutes);

app.use('/', serviceRoutes);

app.use('/', actionRoutes);

app.use('/', reactionRoutes);

app.use('/', areaRoutes);

app.use('/service/twitch', twitchroutes);

app.use("/service/spotify", spotifyroutes);

app.use("/service/github", githubroutes);

app.use("/service/Google", googleroutes);

app.use("/service/gitlab", gitlabroutes);

app.use("/service/linkedin", linkedinroutes);

app.listen(PORT, () => {
    console.log(`server is running on port : ${PORT}`)
})