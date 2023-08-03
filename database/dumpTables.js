const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

let db = new sqlite3.Database("./competition.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

db.serialize(() => {
  db.all(`SELECT * FROM User`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("User.json", JSON.stringify(rows));
    console.log("User data written to User.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM Prediction`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("Prediction.json", JSON.stringify(rows));
    console.log("Prediction data written to Prediction.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM WeeklyScore`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("WeeklyScore.json", JSON.stringify(rows));
    console.log("WeeklyScore data written to WeeklyScore.json");
  });
});

db.serialize(() => {
  db.all(`SELECT * FROM WeeklyPriceHistory`, [], (err, rows) => {
    if (err) {
      throw err;
    }
    fs.writeFileSync("WeeklyPriceHistory.json", JSON.stringify(rows));
    console.log("WeeklyPriceHistory data written to WeeklyPriceHistory.json");
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});
