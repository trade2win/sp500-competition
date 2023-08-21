const express = require("express");
const router = express.Router();
const { createPrediction, findPrediction } = require("../database/predictions");
const { getPreviousWeekClose } = require("../database/weeklyPriceHistory");
const { ensureAuthenticated } = require("../middleware/ensureAuthenticated");
const {
  getCurrentTimeData,
  isTimeToSubmit,
} = require("../services/dateHelpers");
const { body, validationResult } = require("express-validator");

function calculateDirection(prediction, previousWeekClose) {
  return prediction >= previousWeekClose ? 1 : -1;
}

router.get("/", ensureAuthenticated, isTimeToSubmit, async (req, res) => {
  const user_id = req.user.id;

  const dateInfo = getCurrentTimeData();
  const { week, month, quarter, year } = dateInfo;

  const prediction = await findPrediction(user_id, week + 1, year);
  console.log(
    `finding prediction ${user_id} ${week} ${year} and ${JSON.stringify(
      prediction
    )}`
  );
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

router.post("/", ensureAuthenticated, isTimeToSubmit, async (req, res) => {
  if (!req.isTimeToSubmit) {
    return res.status(403).json({
      error:
        "Predictions can only be submitted from 11pm UK time on Friday to 2:30pm UK time on Monday.",
    });
  }

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const prediction = parseFloat(req.body.prediction);
  const user_id = req.user.id;

  let { week, month, quarter, year } = getCurrentTimeData();
  week++;
  if (week > 52) {
    week = 1;
    year++;
  }

  const previousWeekClose = await getPreviousWeekClose(week - 1, year);
  const direction = calculateDirection(prediction, previousWeekClose);

  try {
    await createPrediction(user_id, prediction, direction, week, year);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/prediction");
  }
});

module.exports = router;
