require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { updateLeaderboardForWeek } = require("../services/predictionScoring");
const { getCurrentTimeData } = require("../services/dateHelpers");
const { updateWeek } = require("../services/priceUpdates");
const logger = require("../logger");

const prisma = new PrismaClient();

// Function to update the leaderboard for the current week
async function updateCurrentWeekLeaderboard() {
  try {
    const currentTimeData = getCurrentTimeData();

    // Check if it's Friday (5)
    if (new Date().getDay() !== 5) {
      logger.info("Today is not Friday. Skipping leaderboard update.");
      return;
    }

    logger.debug(
      `Processing week ${currentTimeData.week} of year ${currentTimeData.year}`
    );

    // Fetch data for the current week and store it in the database
    logger.debug(
      `Fetching data for week ${currentTimeData.week} of year ${currentTimeData.year}`
    );
    await updateWeek(currentTimeData.year, currentTimeData.week);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for 1 second

    await updateLeaderboardForWeek(currentTimeData.year, currentTimeData.week);

    logger.info("WeeklyScore for current week updated successfully!");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Failed to update WeeklyScore for current week:", error);
    throw error;
  } finally {
    // Make sure to disconnect from the database when done
    await prisma.$disconnect();
  }
}

logger.info("Starting to update WeeklyScore for current week");
updateCurrentWeekLeaderboard();
