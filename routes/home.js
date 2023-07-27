const express = require("express");
const router = express.Router();

const { findAllPredictions } = require("../database/predictions");
const yahooFinance = require("yahoo-finance2").default;

router.get("/", async (request, response) => {
  try {
    const result = await yahooFinance.quote("^GSPC");
    const sp500Price = result.regularMarketPrice;

    const predictions = await findAllPredictions();

    const viewParameters = {
      user: request.user,
      title: "Welcome to Trade2Win S&P 500 Competition",
      sp500Price: sp500Price,
      predictions: predictions,
    };

    response.render("pages/home", viewParameters);
  } catch (err) {
    console.error(err);
    response.status(500).send("An error occurred while fetching S&P 500 data");
  }
});

module.exports = router;
