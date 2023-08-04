const { PrismaClient } = require("@prisma/client");
const { updateLeaderboardForWeek } = require("../services/predictionScoring");
const logger = require("../logger");

const prisma = new PrismaClient();

// Main function to populate the WeeklyScore table from scratch
async function populateWeeklyScoreTable() {
  try {
    // Retrieve all distinct weeks from the Prediction table, ordered by year and week
    const weeks = await prisma.prediction.groupBy({
      by: ["year", "week"],
      orderBy: [{ year: "asc" }, { week: "asc" }],
    });

    if (!weeks || weeks.length === 0) {
      logger.debug("No weeks found in predictions to process.");
      return;
    }

    logger.debug(`Found ${weeks.length} distinct weeks in predictions`);

    // For each week, call the updateLeaderboardForWeek function to process predictions and update scores
    for (const { year, week } of weeks) {
      logger.debug(`Processing week ${week} of year ${year}`);
      await updateLeaderboardForWeek(year, week);
    }

    logger.debug("WeeklyScore table populated successfully!");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Failed to populate WeeklyScore table:", error);
    throw error;
  } finally {
    // Make sure to disconnect from the database when done
    await prisma.$disconnect();
  }
}

logger.debug("Starting to populate WeeklyScore table");
populateWeeklyScoreTable();
