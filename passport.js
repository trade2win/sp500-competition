// Import core libraries
const passport = require("passport"); // Passport is authentication middleware for Node.js
const OAuth2Strategy = require("passport-oauth2").Strategy; // OAuth 2.0 is an authorization protocol
const axios = require("axios"); // Axios is a promise-based HTTP client for the browser and Node.js

// Import prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Use the OAuth 2.0 strategy within Passport
passport.use(
  "provider",
  new OAuth2Strategy(
    {
      // Define the OAuth2 Strategy configuration parameters
      authorizationURL: process.env.AUTHORIZATION_URL,
      tokenURL: process.env.TOKEN_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, params, profile, done) {
      // Define the function that will be called once the OAuth flow is complete
      // This function is passed the `accessToken` and `refreshToken` obtained from the authorization server

      // Create an Axios instance with default settings
      const website = axios.create({
        baseURL: "https://www.trade2win.com/api/",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Retrieve user information from the authorization server
      website
        .get("/me")
        .then(async (response) => {
          const userData = response.data.me;

          // Use the retrieved user information to find or create a user in the local database
          const user = await prisma.user.upsert({
            where: { providerId: userData.user_id },
            update: {
              username: userData.username,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            create: {
              providerId: userData.user_id,
              username: userData.username,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          });

          return done(null, user);
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }
  )
);

// Register a function that tells Passport how to serialize users
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Register a function that tells Passport how to deserialize users
passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  done(null, user);
});

// Export the configured Passport
module.exports = passport;
