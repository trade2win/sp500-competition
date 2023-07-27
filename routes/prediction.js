const express = require("express");
const router = express.Router();
const { createPrediction, findPrediction } = require("../database/predictions");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");
const { getCurrentTimeData } = require("../utils");

router.get("/", ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;

  const dateInfo = getCurrentTimeData(new Date());
  const { weekOfYear, weekOfMonth, month, year } = dateInfo;

  const prediction = await findPrediction(userId, weekOfYear, year);

  if (prediction) {
    res.render("pages/prediction", { user: req.user, predictionExists: true });
  } else {
    res.render("pages/prediction", { user: req.user, predictionExists: false });
  }
});

router.post("/", ensureAuthenticated, async (req, res) => {
  const forecast = parseFloat(req.body.forecast);
  const userId = req.user.id; // Use the 'id' not the 'providerId'.

  const dateInfo = getCurrentTimeData(new Date());
  const { weekOfYear, weekOfMonth, month, year } = dateInfo;

  try {
    await createPrediction(
      userId,
      forecast,
      weekOfYear,
      weekOfMonth,
      month,
      year
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/prediction");
  }
});

module.exports = router;
