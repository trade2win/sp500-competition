const express = require("express");
const router = express.Router();
const { createPrediction, findPrediction } = require("../database/predictions");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");
const {
  getCurrentTimeData,
  isTimeToSubmit,
} = require("../services/dateHelpers");
const { body, validationResult } = require("express-validator");

router.get("/", ensureAuthenticated, isTimeToSubmit, async (req, res) => {
  const user_id = req.user.id;

  const dateInfo = getCurrentTimeData(new Date());
  const { week, month, quarter, year } = dateInfo;

  const prediction = await findPrediction(user_id, week, year);

  if (prediction) {
    res.render("pages/prediction", {
      user: req.user,
      showForm: false,
      isTimeToSubmit: false,
      alreadyPredicted: true,
    });
  } else if (!req.isTimeToSubmit) {
    res.render("pages/prediction", {
      user: req.user,
      showForm: false,
      isTimeToSubmit: false,
      alreadyPredicted: false,
    });
  } else {
    res.render("pages/prediction", {
      user: req.user,
      showForm: true,
      isTimeToSubmit: true,
      alreadyPredicted: false,
    });
  }
});

router.post(
  "/",
  ensureAuthenticated,
  [
    body("prediction").isFloat({ min: 0, max: 2500 }), // Adjust the range as needed
  ],
  async (req, res) => {
    // Check if current time is within allowed timeframe
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const hour = now.getUTCHours(); // 0 - 23

    if (
      !(
        (dayOfWeek == 5 && hour >= 23) ||
        dayOfWeek == 6 ||
        (dayOfWeek == 0 && hour <= 23)
      )
    ) {
      return res.status(403).json({
        error:
          "Predictions can only be submitted from 11pm UK time on Friday to 11pm UK time on Sunday.",
      });
    }

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prediction = parseFloat(req.body.prediction);
    const user_id = req.user.id;

    let { week, month, quarter, year } = getCurrentTimeData(new Date());
    week++;
    if (week > 52) {
      week = 1;
      year++;
    }

    try {
      await createPrediction(user_id, prediction, week, month, quarter, year);
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.redirect("/prediction");
    }
  }
);

module.exports = router;
