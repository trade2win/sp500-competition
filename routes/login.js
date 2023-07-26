const express = require("express");
const router = express.Router();

// Create login page
router.get("/", function (req, res) {
  const viewParameters = {
    user: req.user,
    title: "Welcome to Trade2Win S&P 500 Competition",
  };
  res.render("pages/login", viewParameters);
});

module.exports = router;
