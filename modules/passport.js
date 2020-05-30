var passport = require("passport");
var googleStrategy = require("passport-google-oauth20").Strategy;
var User = require("../models/user");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        var update = {
          name: profile.displayName,
          email: profile._json.email,
          isAdmin: profile._json.email == process.env.ADMIN,
        };
        var user = await User.findOneAndUpdate(
          { email: profile._json.email },
          update,
          { new: true, upsert: true }
        );

        done(null, user);
      } catch (error) {
        done(null, false);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});
