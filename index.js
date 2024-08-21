const express = require('express')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const router = require('./router/userR')
require('./config/dbconfig')

const app = express()

app.use(express.json())

app.use('/uploads',express.static('uploads'))
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

  app.use(passport.initialize())
  app.use(passport.session())       
  
app.use('/api/v1/user',router)

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(req,accessToken, refreshToken, profile, cb) {

      return cb(null, profile);
  }
));

passport.serializeUser((user,done)=>{
  done(null,user)
})
passport.deserializeUser((user,done)=>{
  done(null,user)
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server connected successfully on port: ${PORT}`);
})