require("dotenv").config();
const { sendCustomEmail } = require("../services/predictionScoring");

async function testSendCustomEmail() {
  const userSummary = {
    userId: 62,
    directionPoints: 1,
    prediction: "correct",
    medalType: "gold",
    medalPoints: 3,
  };
  const closingPrice = 4500;
  const week = 5;
  const year = 2023;

  await sendCustomEmail(userSummary, closingPrice, week, year);
}

testSendCustomEmail();
