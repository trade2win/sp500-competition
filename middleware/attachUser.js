// middleware/attachUser.js

function attachUser(request, response, next) {
  // if user is authenticated in the session, attach the user object to the response so it can be accessed in templates
  if (request.isAuthenticated()) {
    response.locals.user = request.user;
  }
  next();
}

module.exports = attachUser;
