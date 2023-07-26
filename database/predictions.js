// Import the database configuration
const db = require("./config");

// Function to create a new prediction
function createPrediction(userId, prediction, cb) {
  db.run(
    "INSERT INTO forecasts(userId, forecast, week, year) VALUES(?, ?, ?, ?)",
    [userId, prediction.forecast, prediction.week, prediction.year],
    function (err) {
      if (err) {
        return cb(err);
      }
      return cb(null);
    }
  );
}

module.exports = {
  createPrediction,
};
