// database/weeklyPriceHistory.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findPreviousWeekClose(year, week, index_name) {
  const result = await prisma.WeeklyPriceHistory.findFirst({
    where: {
      year: year,
      week: week,
      index_name: index_name,
    },
    orderBy: {
      date: "desc",
    },
    select: {
      close: true,
    },
  });

  if (!result) {
    throw new Error(
      `No record found for year ${year}, week ${week}, index ${index_name}`
    );
  }

  return result.close;
}

const findQuarterlyClosePrices = async (year, quarter) => {
  // Determine the week range based on the quarter
  const startWeek = (quarter - 1) * 13 + 1;
  const endWeek = startWeek + 12;

  return prisma.weeklyPriceHistory.findMany({
    where: {
      year,
      week: {
        gte: startWeek,
        lte: endWeek,
      },
    },
    orderBy: {
      week: "asc",
    },
  });
};

module.exports = {
  findPreviousWeekClose,
  findQuarterlyClosePrices,
};
