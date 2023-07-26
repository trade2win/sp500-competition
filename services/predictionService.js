const { createPrediction } = require("../database/predictions");

function addPrediction(userId, prediction, cb) {
  createPrediction(userId, prediction, cb);
}

module.exports = {
  addPrediction,
};
