const express = require("express");
const router = express.Router();
const { findQuarterPredictions } = require("../database/predictions");
const { findQuarterlyClosePrices } = require("../database/weeklyPriceHistory");
const { getWeekNumbers } = require("../services/dateHelpers");
const logger = require("../logger");

router.get("/:year/Q:quarter", async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const { year, quarter } = req.params;

    const yearNumber = parseInt(year, 10);
    const quarterNumber = parseInt(quarter, 10);

    const predictions = await findQuarterPredictions(yearNumber, quarterNumber);
    predictions.forEach((user) => {
      let totalScore = 0;
      for (const weekNumber in user.predictions) {
        const prediction = user.predictions[weekNumber];
        if (prediction && prediction.weeklyScore) {
          totalScore +=
            prediction.weeklyScore.medal_points +
            prediction.weeklyScore.direction_points; // Including both medal_points and direction_points
        }
      }
      user.totalScore = totalScore;
    });

    // Sorting users by total score in descending order
    predictions.sort((a, b) => b.totalScore - a.totalScore);

    const closePrices = await findQuarterlyClosePrices(
      yearNumber,
      quarterNumber
    );
    const closePricesObject = {};
    closePrices.forEach((price) => {
      closePricesObject[price.week] = price;
    });

    logger.debug(
      `find predictions and close prices for ${yearNumber} ${quarterNumber}`
    );
    logger.debug(JSON.stringify(closePrices));

    const weekNumbers = getWeekNumbers(quarterNumber);

    // Pass the user, quarter, year and weekNumbers to the view along with the predictions
    res.render("pages/results", {
      predictions,
      closePrices: closePricesObject,
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
