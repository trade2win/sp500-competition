const express = require("express");
const router = express.Router();

const yahooFinance = require("yahoo-finance2").default;

// Example endpoint to fetch historical data from Yahoo Finance API
router.get("/", async (request, response) => {
  let myDate = new Date("2023-02-01");
  try {
    const historicalData = await yahooFinance.historical("^GSPC", {
      period1: "2023-04-07", // Replace with your desired start date in milliseconds since epoch
      interval: "1wk", // Daily interval, you can use "1wk" for weekly data, "1mo" for monthly data, etc.
    });

    response.json(historicalData);
  } catch (error) {
    response
      .status(500)
      .json({ error: "An error occurred while fetching data" });
  }
});

module.exports = router;
