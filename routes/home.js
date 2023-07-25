const express = require("express");
const router = express.Router();

// Associate the "/" url path with a given function.
const yahooFinance = require("yahoo-finance2").default;
router.get("/", async (request, response) => {
  try {
    const result = await yahooFinance.quote("^GSPC");
    const sp500Price = result.regularMarketPrice;
    const viewParameters = {
      user: request.user,
      title: "Welcome to Trade2Win S&P 500 Competition",
      sp500Price: sp500Price,
    };

    response.render("pages/home", viewParameters);
  } catch (err) {
    console.error(err);
    response.status(500).send("An error occurred while fetching S&P 500 data");
  }
});

module.exports = router;
