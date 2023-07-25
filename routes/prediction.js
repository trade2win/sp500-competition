const express = require("express");
const router = express.Router();

// Prediction page
router.get("/", function (request, response) {
  const viewParameters = {
    user: request.user,
    title: "Welcome to Trade2Win S&P 500 Competition",
  };
  response.render("pages/prediction", viewParameters);
});

module.exports = router;
