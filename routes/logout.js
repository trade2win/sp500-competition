const express = require("express");
const router = express.Router();
const logger = require("../logger");

// Add a logout route
router.get("/", function (req, res) {
  req.logout(function (err) {
    if (err) {
      // handle the error
      logger.debug(err);
      return res.redirect("/"); // or an error page
    }
    // on successful logout
    res.redirect("/");
  });
});

module.exports = router;
