const express = require("express");
const router = express.Router();
const passport = require("../middleware/passport"); // Use passport for authentication

// Add routes for authentication
// routes for initiating the authentication process
// With this, when a user navigates to /auth/provider,
// they'll be redirected to www.trade2win.com to authenticate. Once they've done
// so, they'll be redirected back to your app at /auth/provider/callback, and
// Passport will handle the authentication.
router.get("/provider", passport.authenticate("provider"));
//  handling the callback from the provider:
router.get(
  "/provider/callback",
  passport.authenticate("provider", { failureRedirect: "/login" }),
  function (request, response) {
    // Successful authentication, redirect home.
    response.redirect("/");
  }
);

module.exports = router;
