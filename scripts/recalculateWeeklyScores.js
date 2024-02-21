const { PrismaClient } = require("@prisma/client");
const { updateLeaderboardForWeek } = require("../services/predictionScoring");
const logger = require("../logger");

const prisma = new PrismaClient();

// Main function to populate the WeeklyScore table from scratch
// Now accepts optional year and week parameters for manual setting
async function populateWeeklyScoreTable(targetYear = null, targetWeek = null) {
  try {
    let weeks = [];

    if (targetYear !== null && targetWeek !== null) {
      // If year and week are specified, process only that specific week
      weeks.push({ year: targetYear, week: targetWeek });
      logger.debug(
        `Manually processing week ${targetWeek} of year ${targetYear}`
      );
    } else {
      // Otherwise, retrieve all distinct weeks from the Prediction table, ordered by year and week
      weeks = await prisma.prediction.groupBy({
        by: ["year", "week"],
        orderBy: [{ year: "asc" }, { week: "asc" }],
      });

      if (!weeks || weeks.length === 0) {
        logger.debug("No weeks found in predictions to process.");
        return;
      }

      logger.debug(`Found ${weeks.length} distinct weeks in predictions`);
    }

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

// Parsing command-line arguments
const args = process.argv.slice(2); // Remove the first two default arguments (node path and script path)
const targetYear = args.length > 0 ? parseInt(args[0], 10) : null;
const targetWeek = args.length > 1 ? parseInt(args[1], 10) : null;

if (Number.isInteger(targetYear) && Number.isInteger(targetWeek)) {
  logger.debug(
    `Starting to populate WeeklyScore table for week ${targetWeek} of year ${targetYear}`
  );
  populateWeeklyScoreTable(targetYear, targetWeek);
} else {
  logger.debug("Starting to populate WeeklyScore table for all weeks");
  populateWeeklyScoreTable();
}
