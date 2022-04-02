require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { v4: uuidv4 } = require("uuid");

const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile?.email }).lean().exec();

      if (!user) {
        user = await User.create({
          first_name: profile?.displayName,
          last_name: profile?.displayName,
          display_name: profile?.displayName,
          email: profile?.email,
          password: uuidv4(),
        });
      }
      return done(null, user);
    }
  )
);

module.exports = passport;
