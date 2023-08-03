// seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getCurrentTimeData } = require("../services/predictionScoring");
const { updateWeek } = require("../services/predictionScoring");

async function main() {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.error("Seeding is only allowed in development or test mode.");
    process.exit(1);
  }

  await prisma.prediction.deleteMany();
  await prisma.user.deleteMany();

  // Create some dummy users
  const user1 = await prisma.user.create({
    data: {
      xenforo_id: 1,
      username: "User 1",
      access_token: "access_token1",
      refresh_token: "refresh_token1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      xenforo_id: 2,
      username: "User 2",
      access_token: "access_token2",
      refresh_token: "refresh_token2",
    },
  });

  const dateInfo = getCurrentTimeData(new Date(2023, 1, 7)); // February 7, 2023

  // Create some dummy predictions
  await prisma.prediction.create({
    data: {
      user_id: user1.id,
      prediction: 5000.0,
      week: dateInfo.week,
      week_of_month: dateInfo.week_of_month,
      month: dateInfo.month,
      year: dateInfo.year,
      points: 0,
    },
  });

  await prisma.prediction.create({
    data: {
      user_id: user2.id,
      prediction: 6000.0,
      week: dateInfo.week,
      week_of_month: dateInfo.week_of_month,
      month: dateInfo.month,
      year: dateInfo.year,
      points: 0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
