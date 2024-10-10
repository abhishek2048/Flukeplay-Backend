const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "google",
  new GoogleStrategy(
    {
      // clientID:process.env.CLIENT_ID, // Your Credentials here.
      clientID:
        "368660609669-e2c8t8is43e4a16u4q6qmeor0p77uhie.apps.googleusercontent.com",
      clientSecret: "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", // Your Credentials here.
      callbackURL: "https://wellnesswarriorsnp.onrender.com/api/user/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);


passport.use(
  "google2",
  new GoogleStrategy(
    {
      // clientID:process.env.CLIENT_ID, // Your Credentials here.
      clientID:
        "368660609669-cocfijcmfu7e7g61jho2o98fmd60po6r.apps.googleusercontent.com",
      clientSecret: "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", // Your Credentials here.
      callbackURL: "https://wellnesswarriorsnp.onrender.com/api/psychologist/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);

