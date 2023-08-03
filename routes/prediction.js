const express = require("express");
const router = express.Router();
const { createPrediction, findPrediction } = require("../database/predictions");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");
const { getCurrentTimeData } = require("../services/dateHelpers");

router.get("/", ensureAuthenticated, async (req, res) => {
  const user_id = req.user.id;

  const dateInfo = getCurrentTimeData(new Date());
  const { week, month, quarter, year } = dateInfo;

  const prediction = await findPrediction(user_id, week, year);

  if (prediction) {
    res.render("pages/prediction", { user: req.user, predictionExists: true });
  } else {
    res.render("pages/prediction", { user: req.user, predictionExists: false });
  }
});

router.post("/", ensureAuthenticated, async (req, res) => {
  const prediction = parseFloat(req.body.prediction);
  const user_id = req.user.id; // Use the 'id' not the 'xenforo_id'.

  const dateInfo = getCurrentTimeData(new Date());
  const { week, month, quarter, year } = dateInfo;

  try {
    await createPrediction(user_id, prediction, week, month, quarter, year);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/prediction");
  }
});

module.exports = router;
