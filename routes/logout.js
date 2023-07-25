const express = require("express");
const router = express.Router();

// Add a logout route
router.get("/", function (request, response) {
  request.logout(function (err) {
    if (err) {
      // handle the error
      console.log(err);
      return response.redirect("/"); // or an error page
    }
    // on successful logout
    response.redirect("/");
  });
});

module.exports = router;
