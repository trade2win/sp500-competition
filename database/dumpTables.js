const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const logger = require("../logger");

let db = new sqlite3.Database("./competition.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  logger.debug("Connected to the SQlite database.");
});

db.serialize(() => {
  db.all(`SELECT * FROM User`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("User.json", JSON.stringify(rows));
    logger.debug("User data written to User.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM Prediction`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("Prediction.json", JSON.stringify(rows));
    logger.debug("Prediction data written to Prediction.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM WeeklyScore`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("WeeklyScore.json", JSON.stringify(rows));
    logger.debug("WeeklyScore data written to WeeklyScore.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM WeeklyPriceHistory`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("WeeklyPriceHistory.json", JSON.stringify(rows));
    logger.debug("WeeklyPriceHistory data written to WeeklyPriceHistory.json");
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  logger.debug("Close the database connection.");
});
