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
  const viewParameters = { title: "Welcome to Trade2Win S&P 500 Competition" };
  // render home.ejs view template with viewParameters
  response.render("pages/home", viewParameters);
});

// Associate the "/test" url path with a given function.
app.get("/test", function (request, response) {
  // respond with an HTML string
  response.send(`<h1>This is a test page</h1> <h2>TEST TEST TEST</h2>`);
});

// Create an ejs test page to play around with the template engine
app.get("/test-ejs", function (request, response) {
  const date = new Date("July 16, 2023 12:04:00");
  const day = date.getDay(); // returns 0-6 (0 = Sunday ... 6 = Saturday)
  let text = "";
  //Check if it's a week day
  if (day > 0 && day < 6) {
    text = "a weekday, it's time to work hard!";
  } else {
    // Else it must be the weekend
    text = "the weekend, it's time to have fun!";
  }
  const viewParameters = { text };
  response.render("pages/test.ejs", viewParameters);
});

// Create exercise page
app.get("/exercise", function (request, response) {
  const data = {
    title: "EJS Tags",
    seconds: new Date().getSeconds(),
    items: ["apple", "banana", "cherry"],
    htmlContent: "<em>This is some em text</em>",
  };
  response.render("pages/exercise", data);
});

// Suggested next step displaying the square of any number
app.get("/square/:number", function (request, response) {
  // grab the number from the request.params object
  const viewParameters = { number: request.params.number };
  response.render("pages/square", viewParameters);
});

// Associate the "/view/SOME-MESSAGE" url path with a function.
app.get("/view/:message", function (request, response) {
  // create object that we will pass into view teplate
  const viewParameters = { message: request.params.message };
  // render viewMessage.ejs view template with viewParameters
  response.render("pages/viewMessage", viewParameters);
});
