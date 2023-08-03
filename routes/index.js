module.exports = {
  home: require("./home"),
  me: require("./me"),
  login: require("./login"),
  logout: require("./logout"),
  prediction: require("./prediction"),
  results: require("./results"),
  auth: require("./auth"),
  api: require("./yahooAPI"),
};

// REMINDER - The Request Object (res)
// The request object represents the data from the incoming request and is passed to all middleware and route handlers.
// -req.headers object with the headers of the incoming request
// -req.params object with any route params
// -req.query object with any key/values from a url query string
// -req.body object key/values of the request body (parsed by the express.urlencoded or express.json middleware)
// -req.method the method of the request as string
