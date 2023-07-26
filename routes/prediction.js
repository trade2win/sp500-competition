const express = require("express");
const router = express.Router();
const { addPrediction } = require("../services/predictionService");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");

// Prediction page
// router.get("/", function (request, response) {
//   const viewParameters = {
//     user: request.user,
//     title: "Welcome to Trade2Win S&P 500 Competition",
//   };
//   response.render("pages/prediction", viewParameters);
// });

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("prediction");
});
router.post("/", ensureAuthenticated, (req, res) => {
  const prediction = req.body.prediction;
  const userId = req.user.providerId;

  addPrediction(userId, prediction, (err) => {
    if (err) {
      console.error(err);
      res.redirect("/prediction");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
