// Import sqlite3 with verbose logging
const sqlite3 = require("sqlite3").verbose();

// Initialize a new sqlite database connection
const db = new sqlite3.Database("./database/competition.db", (err) => {
  if (err) {
    // Log error message if unable to connect to the database
    console.error(err.message);
  }
  // Log success message when successfully connected to the database
  console.log("Connected to the competition database.");
});

// Create users table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      providerId TEXT UNIQUE,
      username TEXT,
      accessToken TEXT,
      refreshToken TEXT
    )`,
  (err) => {
    if (err) {
      // Log error message if unable to create table
      console.error(err);
      return;
    } else {
      // Log success message when table is created
      console.log("Users table created");
    }
  }
);

// Create forecasts table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS forecasts(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      forecast REAL,
      week INTEGER,
      year INTEGER,
      points INTEGER DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id)
    )`,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Forecasts table created");
  }
);

// Create weekly_closes table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS weekly_closes(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      close REAL,
      week INTEGER,
      year INTEGER
    )`,
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Weekly closes table created");
  }
);

module.exports = db;
