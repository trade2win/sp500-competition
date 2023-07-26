// Protecting Routes
// To require authentication for certain routes, use request.isAuthenticated() as middleware:
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },
};
