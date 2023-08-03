// Bring in environment variables from a .env file
const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

// Import Prisma client and Node's built-in filesystem module
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

async function main() {
  // Users
  // Count the current number of User records
  let count = await prisma.user.count();
  // If no User records exist, seed the User data
  if (count === 0) {
    // Load the User data from the JSON file
    const userData = JSON.parse(fs.readFileSync("User.json", "utf-8"));
    // Delete any existing User records (there should be none)
    await prisma.user.deleteMany();
    // Iterate over the User data and create each User in the database
    for (const user of userData) {
      await prisma.user.create({
        data: {
          ...user,
          created_at: new Date(user.created_at),
          updated_at: new Date(user.updated_at),
        },
      });
    }
    // Log the number of Users that were seeded
    console.log(`Seeded ${userData.length} users`);
  }

  // Predictions
  // Repeat the process for the Prediction data
  count = await prisma.prediction.count();
  if (count === 0) {
    const predictionData = JSON.parse(
      fs.readFileSync("Prediction.json", "utf-8")
    );
    await prisma.prediction.deleteMany();
    for (const prediction of predictionData) {
      await prisma.prediction.create({
        data: {
          ...prediction,
          created_at: new Date(prediction.created_at),
          updated_at: new Date(prediction.updated_at),
        },
      });
    }
    console.log(`Seeded ${predictionData.length} predictions`);
  }

  // WeeklyScores
  // Repeat the process for the WeeklyScore data
  count = await prisma.weeklyScore.count();
  if (count === 0) {
    const weeklyScoreData = JSON.parse(
      fs.readFileSync("WeeklyScore.json", "utf-8")
    );
    await prisma.weeklyScore.deleteMany();
    for (const weeklyScore of weeklyScoreData) {
      await prisma.weeklyScore.create({
        data: {
          ...weeklyScore,
          created_at: new Date(weeklyScore.created_at),
          updated_at: new Date(weeklyScore.updated_at),
        },
      });
    }
    console.log(`Seeded ${weeklyScoreData.length} weeklyScores`);
  }

  // WeeklyPriceHistory
  // Repeat the process for the WeeklyPriceHistory data
  count = await prisma.weeklyPriceHistory.count();
  if (count === 0) {
    const weeklyPriceHistoryData = JSON.parse(
      fs.readFileSync("WeeklyPriceHistory.json", "utf-8")
    );
    await prisma.weeklyPriceHistory.deleteMany();
    for (const WeeklyPriceHistory of weeklyPriceHistoryData) {
      await prisma.weeklyPriceHistory.create({
        data: {
          ...WeeklyPriceHistory,
          date: new Date(WeeklyPriceHistory.date),
          created_at: new Date(WeeklyPriceHistory.created_at),
          updated_at: new Date(WeeklyPriceHistory.updated_at),
        },
      });
    }
    console.log(`Seeded ${weeklyPriceHistoryData.length} WeeklyPriceHistory`);
  }
}

main()
  .catch((e) => {
    // Log any errors that occur during the seeding process
    console.error(e);
    // Exit the process with a failure code
    process.exit(1);
  })
  .finally(async () => {
    // Regardless of whether seeding was successful, disconnect from the Prisma Client
    await prisma.$disconnect();
  });
