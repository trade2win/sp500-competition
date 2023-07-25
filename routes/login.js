const express = require("express");
const router = express.Router();

// Create login page
router.get("/", function (request, response) {
  const viewParameters = {
    user: request.user,
    title: "Welcome to Trade2Win S&P 500 Competition",
  };
  response.render("pages/login", viewParameters);
});

module.exports = router;
