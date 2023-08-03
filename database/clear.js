const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const models = {
  user: prisma.user,
  prediction: prisma.prediction,
  weeklyScore: prisma.weeklyScore,
  weeklyPriceHistory: prisma.weeklyPriceHistory,
};

async function main() {
  for (let model in models) {
    try {
      await models[model].deleteMany();
      console.log(`Cleared ${model}`);
    } catch (error) {
      console.log(`Error on model ${model}`, error);
    }
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
