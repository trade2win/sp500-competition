// Bring in environment variables from a .env file
const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

// Import core libraries
const express = require("express"); // Express is a minimalist web framework for Node.js
const session = require("express-session"); // Creates a session middleware for setting up session cookies

// Helmet is one of the most popular and widely used middleware for securing HTTP headers in Node.js/Express applications.
const helmet = require("helmet");

// Import local libraries
const passport = require("./middleware/passport"); // Passport is authentication middleware for Node.js

// Import libraries that enable us to run a cron job
const cron = require("node-cron");
const moment = require("moment-timezone");
const { updateLeaderboard } = require("./services/predictionScoring");

// Import middleware and routes
const attachUser = require("./middleware/attachUser"); // Middleware to attach the user object to the response
const routes = require("./routes"); // Aggregate and manage all route handlers of the application

// Initialize an Express application
const app = express();

// Setup view engine
app.set("views", "views"); // Set the directory for Express.js to find EJS template files
app.set("view engine", "ejs"); // Set the view engine to EJS for dynamic content generation

if (app.get("env") === "production") {
  app.set("view cache", true);
}

// Setup static files directory
app.use(express.static("public"));

// Configure sessions to store data persistently across the user session
app.use(
  session({
    secret: "watermelon", // The secret used to sign the session ID cookie
    resave: false, // Whether to force the session to be saved back to the session store
    saveUninitialized: false, // Whether to force an uninitialized session to be saved to the store
  })
);

// Initialize Passport.js as middleware for the Express app
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing incoming requests with JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define our contentSecurityPolicy
const cspDirectives = {
  directives: {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    "font-src": ["'self'"],
    "img-src": ["'self'"],
    "form-action": [
      "'self'",
      "https://www.trade2win.com/audapi/oauth2/authorize",
    ], // Add your OAuth2 provider URL
  },
};

// Set security-related headers to protect your app from various web attacks.
app.use(helmet());
// Use helmet with your custom CSP settings
app.use(helmet.contentSecurityPolicy(cspDirectives));

// Add middleware to attach the user object to every view if the user is authenticated
app.use(attachUser);

// Apply the routes as middleware to our application
app.use("/", routes.home);
app.use("/me", routes.me);
app.use("/login", routes.login);
app.use("/logout", routes.logout);
app.use("/prediction", routes.prediction);
app.use("/results", routes.results);
app.use("/auth", routes.auth);
app.use("/api/historical", routes.api);

// Check every minute if current time is 10:30 PM Saturday in UK time
cron.schedule("* * * * *", () => {
  const currentUKTime = moment().tz("Europe/London");
  if (
    currentUKTime.day() === 6 &&
    currentUKTime.hour() === 22 &&
    currentUKTime.minute() === 30
  ) {
    updateLeaderboard();
  }
});

// Start the server and listen for incoming requests on the specified port
const port = process.env.PORT || 8000; // The port number to use (process.env.PORT if specified, otherwise 8000)
app.listen(port, function () {
  console.log("App listening on port: " + port); // Print the port number to the console
});
