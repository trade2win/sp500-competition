const { PrismaClient } = require("@prisma/client");
const { updateLeaderboardForWeek } = require("../services/predictionScoring");
const { getCurrentTimeData } = require("../services/dateHelpers");

const prisma = new PrismaClient();

// Function to update the leaderboard for the current week
async function updateCurrentWeekLeaderboard() {
  try {
    const currentTimeData = getCurrentTimeData();

    // Check if it's Friday (5)
    if (new Date().getDay() !== 5) {
      console.log("Today is not Friday. Skipping leaderboard update.");
      return;
    }

    console.log(
      `Processing week ${currentTimeData.week} of year ${currentTimeData.year}`
    );
    await updateLeaderboardForWeek(currentTimeData.year, currentTimeData.week);

    console.log("WeeklyScore for current week updated successfully!");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Failed to update WeeklyScore for current week:", error);
    throw error;
  } finally {
    // Make sure to disconnect from the database when done
    await prisma.$disconnect();
  }
}

console.log("Starting to update WeeklyScore for current week");
updateCurrentWeekLeaderboard();
