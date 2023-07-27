const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPrediction(
  userId,
  forecast,
  weekOfYear,
  weekOfMonth,
  month,
  year
) {
  return await prisma.forecast.create({
    data: {
      userId,
      forecast,
      weekOfYear,
      weekOfMonth,
      month,
      year,
    },
  });
}

async function findPrediction(userId, weekOfYear, year) {
  return await prisma.forecast.findFirst({
    where: {
      userId,
      weekOfYear,
      year,
    },
  });
}

async function findAllPredictions() {
  return await prisma.forecast.findMany({
    include: {
      user: true,
    },
  });
}

module.exports = {
  createPrediction,
  findPrediction,
  findAllPredictions,
};
