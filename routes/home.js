const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;
const { findQuarterPredictions } = require("../database/predictions");
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
    const predictions = await findQuarterPredictions(
      currentYear,
      currentQuarter
    );
    const weekNumbers = getWeekNumbers(currentQuarter);

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
