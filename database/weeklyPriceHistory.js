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

module.exports = {
  findPreviousWeekClose,
};
