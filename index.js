// Get express, an installed package from node_modules.
const express = require("express");

// Create an express app that'll handle http requests and responses.
const app = express();

// Specify which port to use (process.env.PORT if specified, OR 8000 otherwise)
const port = process.env.PORT || 8000;

// Tell app to listen for incoming requests on the specified port
app.listen(port, function () {
  console.log("App listening on port: " + port);
});

// Tell the app where to find view files (in the views folder)
app.set("views", "views");

// Tell the app that we'll use ejs as our view engine (i.e. template language)
app.set("view engine", "ejs");

// Tell the app where to find static files (i.e. .css, .js, images, etc)
app.use(express.static("public"));

// Associate the "/" url path with a given function.
app.get("/", function (request, response) {
  // create object that we will pass into view teplate
  const viewParameters = { title: "Welcome to Web Project V0!" };
  // render home.ejs view template with viewParameters
  response.render("home", viewParameters);
});

// Associate the "/test" url path with a given function.
app.get("/test", function (request, response) {
  // respond with an HTML string
  response.send(`<h1>This is a test page</h1> <h2>TEST TEST TEST</h2>`);
});

// Associate the "/view/SOME-MESSAGE" url path with a function.
app.get("/view/:message", function (request, response) {
  // create object that we will pass into view teplate
  const viewParameters = { message: request.params.message };
  // render viewMessage.ejs view template with viewParameters
  response.render("viewMessage", viewParameters);
});
