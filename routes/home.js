const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;
const { findQuarterPredictions } = require("../database/predictions");
const { findQuarterlyClosePrices } = require("../database/weeklyPriceHistory");
const { findPreviousWeekClose } = require("../database/weeklyPriceHistory");
const {
  getWeekNumbers,
  getCurrentQuarter,
} = require("../services/dateHelpers");
const dateHelpers = require("../services/dateHelpers.js");

router.get("/", async (req, res) => {
  try {
    const result = await yahooFinance.quote("^GSPC");
    const sp500Price = result.regularMarketPrice;

    const user_id = req.user ? req.user.id : null; // if not logged in then return null

    const currentTimeData = dateHelpers.getCurrentTimeData(true);
    const currentYear = new Date().getFullYear();
    const currentQuarter = getCurrentQuarter();

    const weekNumbers = getWeekNumbers(currentQuarter);

    // Determine the current week number
    let currentWeekNumber = currentTimeData.week;

    // Check if it's a weekend (Saturday or Sunday)
    const isWeekend = new Date().getDay() % 6 === 0;

    // If it's the weekend, adjust the current week number to the next week
    if (isWeekend) {
      currentWeekNumber++;
    }

    const futureWeeksIndex = weekNumbers.indexOf(currentWeekNumber) + 1; // +1 to start with the week after the current one

    if (futureWeeksIndex < weekNumbers.length - 1) {
      // Check if there are more than one future weeks
      const start = weekNumbers[futureWeeksIndex];
      const end = weekNumbers[weekNumbers.length - 1];
      weekNumbers.length = futureWeeksIndex; // Trim the array to include only up to the current week
      weekNumbers.push(`${start}-${end}`); // Combine the future weeks into a single entry
    }

    const predictions = await findQuarterPredictions(
      currentYear,
      currentQuarter
    );
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
      currentYear,
      currentQuarter
    );
    const closePricesObject = {};
    closePrices.forEach((price) => {
      closePricesObject[price.week] = price;
    });

    // Fetch the closing price of the previous week
    const previousClose = await findPreviousWeekClose(
      currentTimeData.year,
      currentTimeData.week - 1,
      "^GSPC"
    );

    const viewParameters = {
      user: req.user,
      title: "S&P 500 Contest",
      sp500Price: sp500Price,
      predictions: predictions,
      closePrices: closePricesObject,
      previousClose: previousClose,
      weekNumbers: weekNumbers,
      quarter: currentQuarter,
      year: currentYear,
    };

    res.render("pages/home", viewParameters);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching S&P 500 data");
  }
});

module.exports = router;
