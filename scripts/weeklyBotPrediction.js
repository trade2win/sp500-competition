require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { getCurrentTimeData } = require("../services/dateHelpers");
const { findPreviousWeekClose } = require("../database/weeklyPriceHistory");

const logger = require("../logger");

const prisma = new PrismaClient();

async function postBotPrediction() {
  try {
    const currentTimeData = getCurrentTimeData();

    // Check if it's Monday (1)
    if (new Date().getDay() !== 1) {
      logger.info("Today is not Monday. Skipping bot prediction update.");
      return;
    }

    const predictions = await prisma.prediction.findMany({
      where: {
        week: currentTimeData.week,
        year: currentTimeData.year,
      },
    });

    const totalPredictions = predictions.length;
    const averagePrediction =
      predictions.reduce((sum, prediction) => sum + prediction.prediction, 0) /
      totalPredictions;

    if (isNaN(averagePrediction)) {
      logger.warn(
        "Average prediction is NaN. This might be due to no predictions for the current week."
      );
      return;
    }

    const previousWeek =
      currentTimeData.week === 1 ? 52 : currentTimeData.week - 1;
    const previousYear =
      currentTimeData.week === 1
        ? currentTimeData.year - 1
        : currentTimeData.year;

    const previousWeekClosePrice = await findPreviousWeekClose(
      previousYear,
      previousWeek,
      "^GSPC"
    );

    const direction = averagePrediction > previousWeekClosePrice ? 1 : -1;

    await prisma.prediction.create({
      data: {
        user_id: 62,
        prediction: averagePrediction,
        direction: direction,
        week: currentTimeData.week,
        year: currentTimeData.year,
      },
    });

    logger.info("T2W Bot prediction for current week updated successfully!");
  } catch (error) {
    console.error(
      "Failed to update T2W Bot prediction for current week:",
      error
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

logger.info("Starting to update T2W Bot prediction for current week");
postBotPrediction();
