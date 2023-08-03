// Import required modules
const yahooFinance = require("yahoo-finance2").default;
const { PrismaClient } = require("@prisma/client");
const { getDateOfISOWeek } = require("./dateHelpers");

// Create Prisma client
const prisma = new PrismaClient();

/**
 * Fetch historical data for a given index from Yahoo Finance
 * @param {string} indexName - Name of the index
 * @param {Date} period1 - Start date of the period as a Date instance
 * @param {Date} period2 - (only required so far as to limit the data we get back) End date of the period as a Date instance
 * @param {string} interval - Interval for fetching data (e.g. "1wk" for one week)
 * @return {Promise<object[]>} Promise resolving to array of data objects
 */

// Note that only period 1 is required, and it uses sunday midnight as the crossover date,
// so if you ask the API for data between these crossover, you'll get that week
async function fetchHistoricalData(indexName, period1, interval) {
  const period2 = new Date(period1.getTime() + 7 * 24 * 60 * 60 * 1000);
  console.log(`yahoo is getting ${period1}`);
  return await yahooFinance.historical(indexName, {
    period1,
    period2,
    interval,
  });
}

// await yahooFinance.historical("^GSPC", {
//   period1: "2023-04-07", // Replace with your desired start date in milliseconds since epoch
//   interval: "1wk", // Daily interval, you can use "1wk" for weekly data, "1mo" for monthly data, etc.
// });

/**
 * Update data for a specific week of a year
 * @param {number} year - Year
 * @param {number} week - Week of the year
 */
async function updateWeek(year, week) {
  console.log(`Updating week ${week} for year ${year}`);

  // Get the date corresponding to the start of the specified week of the year
  const date = getDateOfISOWeek(year, week);

  // Get the date corresponding to the start of the previous week
  const period1 = new Date(date.getTime()); //

  // Try to find data for the previous week in the database
  let previousWeek = await prisma.WeeklyPriceHistory.findFirst({
    where: { week: week - 1, year },
    orderBy: { date: "desc" },
  });

  // If data for the previous week is not found in the database, fetch it from Yahoo Finance
  if (!previousWeek) {
    const previousWeekData = await fetchHistoricalData(
      "^GSPC",
      new Date(period1.getTime() - 7 * 24 * 60 * 60 * 1000),
      "1wk"
    );
    previousWeek = previousWeekData[previousWeekData.length - 1];
  }

  // Fetch historical data for the specified week from Yahoo Finance
  const historicalData = await fetchHistoricalData("^GSPC", period1, "1wk");
  console.log(`Fetched historical data for week ${week} of ${year}`);

  // If we have data for the specified week
  if (historicalData.length > 0) {
    const weekData = historicalData[historicalData.length - 1];

    // add some logging
    console.log(
      `period1 is ${period1} and weekData is ${JSON.stringify(weekData)}`
    );

    // Store fetched data in the database
    const createdWeekData = await prisma.WeeklyPriceHistory.create({
      data: {
        date: weekData.date,
        index_name: "^GSPC",
        open: weekData.open,
        high: weekData.high,
        low: weekData.low,
        close: weekData.close,
        previous_close: previousWeek.close,
        week,
        year,
      },
    });

    console.log(`Successfully updated data for week ${week} of ${year}`);
    return createdWeekData;
  } else {
    console.log(`No data available for week ${week} of ${year}`);
  }
}

module.exports = {
  updateWeek,
};
