const { PrismaClient } = require("@prisma/client");
const { updateLeaderboardForWeek } = require("../services/predictionScoring");

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
      console.log("No weeks found in predictions to process.");
      return;
    }

    console.log(`Found ${weeks.length} distinct weeks in predictions`);

    // For each week, call the updateLeaderboardForWeek function to process predictions and update scores
    for (const { year, week } of weeks) {
      console.log(`Processing week ${week} of year ${year}`);
      await updateLeaderboardForWeek(year, week);
    }

    console.log("WeeklyScore table populated successfully!");
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Failed to populate WeeklyScore table:", error);
    throw error;
  } finally {
    // Make sure to disconnect from the database when done
    await prisma.$disconnect();
  }
}

console.log("Starting to populate WeeklyScore table");
populateWeeklyScoreTable();
