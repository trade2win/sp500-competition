// Import prisma client
const { PrismaClient } = require("@prisma/client");

// Initialize prisma client
const prisma = new PrismaClient();

// Delete existing scores for a given week and year
async function deleteExistingScores(year, week) {
  console.log(`Deleting existing scores for week ${week}, year ${year}`);
  // Deleting scores using Prisma's deleteMany operation
  await prisma.weeklyScore.deleteMany({
    where: { week, year },
  });
}

// Retrieve predictions for a given week and year
async function fetchPredictions(year, week) {
  console.log(`Fetching predictions for week ${week}, year ${year}`);
  // Fetching predictions using Prisma's findMany operation
  const predictions = await prisma.prediction.findMany({
    where: { week, year },
    orderBy: { created_at: "asc" },
  });

  // Handle the case if no predictions were found
  if (!predictions || predictions.length === 0) {
    console.log(`No predictions for week ${week}, year ${year}`);
    return;
  }

  return predictions;
}

// Retrieve closing price and previous close price for a given week and year
async function fetchWeeklyPriceHistory(year, week) {
  console.log(`Fetching price history for week ${week}, year ${year}`);
  // Fetching weeklyPriceHistory using Prisma's findFirst operation
  const weeklyPriceHistory = await prisma.weeklyPriceHistory.findFirst({
    where: { week, year },
    orderBy: { date: "desc" },
  });

  // Handle the case if no price history was found
  if (!weeklyPriceHistory) {
    console.log(`No price history for week ${week}, year ${year}`);
    return;
  }

  return weeklyPriceHistory;
}

// Process predictions by calculating direction points
async function processPredictions(predictions, previousClose, actualValue) {
  console.log(`Processing ${predictions.length} predictions`);

  // For each prediction, calculate direction points
  predictions.map((prediction) => {
    calculateDirectionPoints(prediction, previousClose, actualValue);
    return prediction;
  });

  return predictions;
}

// Calculate direction points based on whether prediction was in the correct direction
function calculateDirectionPoints(prediction, previousClose, actualValue) {
  // Define a variable to hold the direction point
  let directionPoint = 0;

  // Only calculate the direction point when both previousClose and actualValue are valid numbers
  if (typeof previousClose === "number" && typeof actualValue === "number") {
    const correctDirection =
      actualValue > previousClose === (prediction.direction === 1);
    directionPoint = correctDirection ? 1 : -1;
  }

  // Assign direction points
  prediction.direction_points = directionPoint;
  console.log(
    `Direction Points for user ${prediction.user_id}: ${directionPoint}`
  );
}

// Assign medal points based on sorted correct direction predictions
async function assignMedalPoints(predictions, actualValue) {
  console.log(`Assigning medal points for ${predictions.length} predictions`);

  // For each prediction, calculate medal points
  predictions.map((prediction) => {
    calculateMedalPoints(predictions, prediction, actualValue);
    return prediction;
  });

  return predictions;
}

// Calculate medal points based on closeness to the actual closing price
function calculateMedalPoints(predictions, prediction, actualValue) {
  // Filter predictions to only those with correct direction
  const correctDirectionPredictions = predictions.filter(
    (pred) => pred.direction_points > 0
  );

  console.log("Correct Direction Predictions: ", correctDirectionPredictions);

  // If current prediction does not have a correct direction, then no medal points are awarded
  if (prediction.direction_points <= 0) {
    prediction.medal_points = 0;
    return prediction;
  }

  // Sort filtered predictions by closeness to the actual value
  correctDirectionPredictions.sort(
    (a, b) =>
      Math.abs(a.prediction - actualValue) -
      Math.abs(b.prediction - actualValue)
  );

  console.log(
    "Sorted Correct Direction Predictions: ",
    correctDirectionPredictions
  );

  // Determine the index of the current prediction in the sorted list
  const medalIndex = correctDirectionPredictions.findIndex(
    (pred) => pred.user_id === prediction.user_id
  );

  console.log("Medal Index: ", medalIndex);

  // Determine medal points based on the index
  prediction.medal_points =
    medalIndex >= 0 && medalIndex < 3 ? 3 - medalIndex : 0;

  console.log("Medal Points: ", prediction.medal_points);

  return prediction;
}

// Update weekly scores in the database based on processed predictions
async function updateWeeklyScores(predictions, year, week) {
  console.log(`Updating weekly scores for week ${week}, year ${year}`);

  // For each prediction, update or create a score in the database
  for (const prediction of predictions) {
    await updateOrCreateScore(prediction, year, week);
  }
}

// Update or create a score in the database based on a given prediction
async function updateOrCreateScore(prediction, year, week) {
  // Check if a score already exists for this user, week, and year
  const existingWeeklyScore = await prisma.weeklyScore.findFirst({
    where: { user_id: prediction.user_id, week, year },
  });

  console.log(
    `Creating Score for user ${prediction.user_id} with direction points: ${prediction.direction_points} and medal points: ${prediction.medal_points}`
  );

  // If score exists, update it. If not, create a new one.
  if (existingWeeklyScore) {
    await prisma.weeklyScore.update({
      where: { id: existingWeeklyScore.id },
      data: {
        direction_points: { increment: prediction.direction_points },
        medal_points: { increment: prediction.medal_points },
      },
    });
  } else {
    await prisma.weeklyScore.create({
      data: {
        user_id: prediction.user_id,
        direction_points: prediction.direction_points,
        medal_points: prediction.medal_points,
        week,
        year,
      },
    });
  }
}

// Main function to run leaderboard update for a given week and year
async function updateLeaderboardForWeek(year, week) {
  console.log(
    `Running updateLeaderboardForWeek for year ${year}, week ${week}`
  );

  try {
    // Delete existing scores for this week and year
    await deleteExistingScores(year, week);

    // Fetch predictions for this week and year
    const predictions = await fetchPredictions(year, week);

    // If no predictions found, return early
    if (!predictions || predictions.length === 0) {
      console.log(`No predictions for week ${week}, year ${year}`);
      return;
    }

    // Fetch the closing price for this week and year
    const weeklyPriceHistory = await fetchWeeklyPriceHistory(year, week);

    console.log(
      `predictions = ${JSON.stringify(
        predictions
      )} and weeklyPriceHistory is ${JSON.stringify(weeklyPriceHistory)}`
    );

    // If no price history found, return early
    if (!weeklyPriceHistory) {
      console.log(`No price history for week ${week}, year ${year}`);
      return;
    }

    // Process the predictions
    const actualValue = weeklyPriceHistory.close;
    const previousClose = weeklyPriceHistory.previous_close;
    const processedPredictions = await processPredictions(
      predictions,
      previousClose,
      actualValue
    );

    // Assign medal points
    const finalPredictions = await assignMedalPoints(
      processedPredictions,
      actualValue
    );

    // Update the weekly scores in the database
    await updateWeeklyScores(finalPredictions, year, week);

    console.log("Leaderboard updated successfully!");
  } catch (error) {
    console.error("Failed to update leaderboard:", error);
    throw error;
  }
}

module.exports = { updateLeaderboardForWeek };