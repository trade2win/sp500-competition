// Protecting Routes
// To require authentication for certain routes, use request.isAuthenticated() as middleware:
module.exports = function ensureAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
};
