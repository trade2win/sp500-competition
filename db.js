// const Pool = require("pg").Pool;

// const pool = new Pool({
//   user: "",
//   password: "",
//   host: "",
//   port: 0,
//   database: "",
// });
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./database/users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");
});

db.run(
  `CREATE TABLE users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  providerId TEXT UNIQUE,
  username TEXT,
  accessToken TEXT,
  refreshToken TEXT
)`,
  (err) => {
    if (err) {
      // Table already created
    } else {
      console.log("Users table created");
    }
  }
);

function findById(id, cb) {
  db.get("SELECT * FROM users WHERE id = ?", id, (err, row) => {
    return cb(err, row);
  });
}

function findOrCreate(user, cb) {
  // First, try to find the user
  db.get(
    "SELECT * FROM users WHERE providerId = ?",
    user.providerId,
    (err, row) => {
      if (err) {
        return cb(err);
      }
      if (row) {
        // If user is found, return it
        return cb(null, row);
      } else {
        // If user is not found, create a new one
        db.run(
          "INSERT INTO users(providerId, username, accessToken, refreshToken) VALUES(?, ?, ?, ?)",
          [user.providerId, user.username, user.accessToken, user.refreshToken],
          function (err) {
            if (err) {
              return cb(err);
            }
            db.get(
              "SELECT * FROM users WHERE id = ?",
              this.lastID,
              (err, row) => {
                return cb(null, row);
              }
            );
          }
        );
      }
    }
  );
}

module.exports = {
  findOrCreate,
  findById,
};
