const express = require("express");
const router = express.Router();

// Prediction receiving page
router.post("/", function (request, response) {
  console.log(request.body);
  response.render("pages/prediction.ejs", {
    prediction: request.body["prediction"],
  });
});

module.exports = router;
