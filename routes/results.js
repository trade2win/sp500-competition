const express = require("express");
const router = express.Router();
const { findQuarterPredictions } = require("../database/predictions");
const { getWeekNumbers } = require("../services/dateHelpers");

router.get("/:year/Q:quarter", async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const { year, quarter } = req.params;

    const yearNumber = parseInt(year, 10);
    const quarterNumber = parseInt(quarter, 10);

    const predictions = await findQuarterPredictions(yearNumber, quarterNumber);
    console.log(yearNumber, quarterNumber);

    const weekNumbers = getWeekNumbers(quarterNumber);

    // Pass the user, quarter, year and weekNumbers to the view along with the predictions
    res.render("pages/results", {
      predictions,
      user: req.user,
      quarter: quarterNumber,
      year: yearNumber,
      weekNumbers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while trying to fetch quarter predictions.");
  }
});

module.exports = router;
