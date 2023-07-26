const db = require("../database/config");

// Function to find user by ID
function findById(id, cb) {
  db.get("SELECT * FROM users WHERE id = ?", id, (err, row) => {
    return cb(err, row);
  });
}

// Function to find or create a user
function findOrCreate(user, cb) {
  // First, try to find the user
  db.get(
    "SELECT * FROM users WHERE providerId = ?",
    user.providerId,
    (err, row) => {
      if (err) {
        // If there's an error, return it
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
              // If there's an error, return it
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

// Export the findOrCreate and findById functions
module.exports = {
  findOrCreate,
  findById,
};
