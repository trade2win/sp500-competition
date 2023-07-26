// middleware/attachUser.js

function attachUser(req, res, next) {
  // if user is authenticated in the session, attach the user object to the response so it can be accessed in templates
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
}

module.exports = attachUser;
