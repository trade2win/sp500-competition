const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;
const { findQuarterPredictions } = require("../database/predictions");
const {
  getWeekNumbers,
  getCurrentQuarter,
} = require("../services/dateHelpers");

router.get("/", async (req, res) => {
  try {
    const result = await yahooFinance.quote("^GSPC");
    const sp500Price = result.regularMarketPrice;

    const user_id = req.user ? req.user.id : null; // if not logged in then return null

    const currentYear = new Date().getFullYear();
    const currentQuarter = getCurrentQuarter();
    const predictions = await findQuarterPredictions(
      currentYear,
      currentQuarter
    );
    const weekNumbers = getWeekNumbers(currentQuarter);

    const viewParameters = {
      user: req.user,
      title: "Welcome to Trade2Win S&P 500 Competition",
      sp500Price: sp500Price,
      predictions: predictions,
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
