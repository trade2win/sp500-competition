const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
    {
      emit: "stdout",
      level: "error",
    },
  ],
});

// Creates a new prediction for a specific user, week, month, quarter, and year
async function createPrediction(
  user_id,
  prediction,
  week,
  month,
  quarter,
  year
) {
  return await prisma.prediction.create({
    data: {
      user_id,
      prediction,
      week,
      month,
      quarter,
      year,
    },
  });
}

// Finds the first prediction made by a specific user in a specific week and year
async function findPrediction(user_id, week, year) {
  return await prisma.prediction.findFirst({
    where: {
      user_id,
      week,
      year,
    },
  });
}

// Finds all predictions made by all users
async function findAllPredictions() {
  return await prisma.prediction.findMany({
    include: {
      user: true,
    },
  });
}

// Creates a new prediction for a specific user, week, month, quarter, and year
async function createPrediction(
  user_id,
  prediction,
  week,
  month,
  quarter,
  year
) {
  return await prisma.prediction.create({
    data: {
      user_id,
      prediction,
      week,
      month,
      quarter,
      year,
    },
  });
}

// Finds the first prediction made by a specific user in a specific week and year
async function findPrediction(user_id, week, year) {
  return await prisma.prediction.findFirst({
    where: {
      user_id,
      week,
      year,
    },
  });
}

// Finds all predictions made by all users
async function findAllPredictions() {
  return await prisma.prediction.findMany({
    include: {
      user: true,
    },
  });
}

// Finds all weekly scores in a specific quarter of a specific year
async function findQuarterScores(year, quarter) {
  // Define the weeks that belong to the specified quarter
  const quarterWeeks = {
    1: { start: 1, end: 13 },
    2: { start: 14, end: 26 },
    3: { start: 27, end: 39 },
    4: { start: 40, end: 52 },
  };

  const weeks = quarterWeeks[quarter];

  console.log(`Weeks for quarter ${quarter}: `, weeks);

  // Find all weekly scores made in the specified quarter and year
  const scores = await prisma.weeklyScore.findMany({
    where: {
      year: year,
      week: {
        gte: weeks.start,
        lte: weeks.end,
      },
    },
    select: {
      user_id: true,
      direction_points: true,
      medal_points: true,
      week: true,
      year: true,
    },
  });

  console.log(
    `Retrieved ${scores.length} scores for quarter ${quarter}, year ${year}`
  );

  return scores;
}

// Finds all predictions made in a specific quarter of a specific year
async function findQuarterPredictions(year, quarter) {
  // Define the weeks that belong to the specified quarter
  const quarterWeeks = {
    1: { start: 1, end: 13 },
    2: { start: 14, end: 26 },
    3: { start: 27, end: 39 },
    4: { start: 40, end: 52 },
  };

  const weeks = quarterWeeks[quarter];

  console.log(`Weeks for quarter ${quarter}: `, weeks);

  // Find all predictions made in the specified quarter and year
  const predictions = await prisma.prediction.findMany({
    where: {
      year: year,
      week: {
        gte: weeks.start,
        lte: weeks.end,
      },
    },
    select: {
      user_id: true,
      user: true,
      week: true,
      prediction: true,
      direction: true,
    },
  });

  // Get the scores for the same quarter and year
  const scores = await findQuarterScores(year, quarter);

  console.log(
    `Retrieved ${predictions.length} predictions and ${scores.length} scores for quarter ${quarter}, year ${year}`
  );

  // Group predictions by user and week, and merge with scores
  const quarterPredictions = [];
  predictions.forEach((prediction) => {
    console.log(
      `Processing prediction for user id ${prediction.user_id}, week ${prediction.week}`
    );

    // Find the corresponding score for this prediction
    const score = scores.find(
      (score) =>
        score.user_id === prediction.user_id && score.week === prediction.week
    );

    const user = quarterPredictions.find(
      (user) => user.id === prediction.user_id
    );

    if (user) {
      user.predictions[prediction.week] = { ...prediction, weeklyScore: score };
    } else {
      quarterPredictions.push({
        id: prediction.user_id,
        name: prediction.user.username,
        predictions: {
          [prediction.week]: { ...prediction, weeklyScore: score },
        },
      });
    }
  });

  console.log(
    `Formatted ${quarterPredictions.length} users' predictions for quarter ${quarter}, year ${year}`
  );

  return quarterPredictions;
}

module.exports = {
  createPrediction,
  findPrediction,
  findAllPredictions,
  findQuarterPredictions, // export the new function
};