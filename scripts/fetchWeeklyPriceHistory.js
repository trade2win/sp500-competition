// Import required modules
const { updateWeek } = require("../services/priceUpdates");
const { getCurrentTimeData } = require("../services/dateHelpers");
const logger = require("../logger");

/**
 * Fetch historical data for all weeks of a given year and store it in the database
 * If the current year is passed, it fetches data only up to the week before the current one
 * @param {number} year - Year for which to fetch historical data
 */
async function importHistoricalData(year) {
  // Get the current year and week
  const currentTimeData = getCurrentTimeData();

  // Calculate the number of weeks to fetch
  // If the current year is passed, fetch data only up to the week before the current one
  // Otherwise, fetch data for all weeks of the year
  const numWeeks =
    year === currentTimeData.year ? currentTimeData.week - 1 : 53;

  logger.debug(`Fetching data for year ${year}`);

  // Fetch data for each week and store it in the database
  for (let week = 1; week <= numWeeks; week++) {
    logger.debug(`Fetching data for week ${week}`);
    await updateWeek(year, week);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second
  }
}

// Get the input year from command-line arguments
const inputYear = process.argv[2]; // The first command-line argument after the script name

// If the input year is provided as a command-line argument, use it; otherwise, use the current year
const yearToFetch = inputYear ? parseInt(inputYear) : new Date().getFullYear();

// Call the function to fetch historical data for the specified year
importHistoricalData(yearToFetch).catch((error) => console.error(error));
