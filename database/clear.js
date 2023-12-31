// Bring in environment variables from a .env file
const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `../.env.${env}`) });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const logger = require("../logger");

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
      logger.debug(`Cleared ${model}`);
    } catch (error) {
      logger.debug(`Error on model ${model} ${error}`);
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
