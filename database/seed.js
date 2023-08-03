const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

async function main() {
  const userData = JSON.parse(fs.readFileSync("User.json", "utf-8"));

  for (const user of userData) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`Seeded ${userData.length} users`);

  // Prediction
  const predictionData = JSON.parse(
    fs.readFileSync("Prediction.json", "utf-8")
  );

  for (const prediction of predictionData) {
    await prisma.prediction.create({
      data: prediction,
    });
  }

  console.log(`Seeded ${prediction.length} predictions`);

  // WeeklyScore
  const weeklyScoreData = JSON.parse(
    fs.readFileSync("WeeklyScore.json", "utf-8")
  );

  for (const weeklyScore of weeklyScoreData) {
    await prisma.weeklyscore.create({
      data: weeklyScore,
    });
  }

  console.log(`Seeded ${weeklyScoreData.length} weeklyScoreData`);

  // WeeklyPriceHistory
  const weeklyPriceHistoryData = JSON.parse(
    fs.readFileSync("WeeklyPriceHistory.json", "utf-8")
  );

  for (const WeeklyPriceHistory of weeklyPriceHistoryData) {
    await prisma.weeklypricehistory.create({
      data: WeeklyPriceHistory,
    });
  }

  console.log(`Seeded ${weeklyPriceHistoryData.length} WeeklyPriceHistory`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
