const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const db = require("./db");
const axios = require("axios");

passport.use(
  "provider",
  new OAuth2Strategy(
    {
      authorizationURL: "https://www.trade2win.com/audapi/oauth2/authorize",
      tokenURL: "https://www.trade2win.com/api/audapi-oauth2/token",
      clientID: "98d70a77-3f0e-40f8-a137-5bbbb9ad609e",
      clientSecret:
        "a569028bdb66e9da2576cd8967241c51b24acdef367333d39a64adcd29b7e884",
      callbackURL: "http://127.0.0.1:8000/auth/provider/callback",
    },
    function (accessToken, refreshToken, params, done) {
      const website = axios.create({
        baseURL: "https://www.trade2win.com/api/",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      website
        .get("/me")
        .then((response) => {
          const userData = response.data.me;

          db.findOrCreate(
            {
              providerId: userData.user_id,
              username: userData.username,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            function (err, user) {
              return done(err, user);
            }
          );
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
