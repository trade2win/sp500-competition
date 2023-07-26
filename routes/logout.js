const express = require("express");
const router = express.Router();

// Add a logout route
router.get("/", function (req, res) {
  req.logout(function (err) {
    if (err) {
      // handle the error
      console.log(err);
      return res.redirect("/"); // or an error page
    }
    // on successful logout
    res.redirect("/");
  });
});

module.exports = router;
