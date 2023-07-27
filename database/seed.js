// seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getCurrentTimeData } = require("../utils");

async function main() {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.error("Seeding is only allowed in development or test mode.");
    process.exit(1);
  }

  await prisma.forecast.deleteMany();
  await prisma.user.deleteMany();

  // Create some dummy users
  const user1 = await prisma.user.create({
    data: {
      providerId: 1,
      username: "User 1",
      accessToken: "accessToken1",
      refreshToken: "refreshToken1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      providerId: 2,
      username: "User 2",
      accessToken: "accessToken2",
      refreshToken: "refreshToken2",
    },
  });

  const dateInfo = getCurrentTimeData(new Date(2023, 1, 7)); // February 7, 2023

  // Create some dummy forecasts
  await prisma.forecast.create({
    data: {
      userId: user1.id,
      forecast: 5000.0,
      weekOfYear: dateInfo.weekOfYear,
      weekOfMonth: dateInfo.weekOfMonth,
      month: dateInfo.month,
      year: dateInfo.year,
      points: 0,
    },
  });

  await prisma.forecast.create({
    data: {
      userId: user2.id,
      forecast: 6000.0,
      weekOfYear: dateInfo.weekOfYear,
      weekOfMonth: dateInfo.weekOfMonth,
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
