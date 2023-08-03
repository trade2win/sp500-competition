function getCurrentQuarter() {
  const month = new Date().getMonth() + 1; // getMonth() is zero-indexed
  return Math.ceil(month / 3);
}

module.exports = {
  getWeekNumbers,
  getCurrentQuarter,
};

function getWeekNumbers(quarter) {
  const quarterWeeks = {
    1: { start: 1, end: 13 },
    2: { start: 14, end: 26 },
    3: { start: 27, end: 39 },
    4: { start: 40, end: 52 },
  };
  const weeks = quarterWeeks[quarter];

  const weekNumbers = [];
  for (let i = weeks.start; i <= weeks.end; i++) {
    weekNumbers.push(i);
  }

  return weekNumbers;
}

module.exports = {
  getWeekNumbers,
};

/**
 * Returns the current week, month, quarter, and year
 * @return {Object} An object containing week, month, quarter, and year
 * example: { "week": 31, "month": 8, "quarter": 3,"year": 2023
 */
function getCurrentTimeData() {
  const currentDate = new Date();

  // Calculate week of the year
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const week =
    Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24 * 7)) + 1;

  // Calculate month (0-based in JavaScript, so adding 1 to make it 1-based)
  const month = currentDate.getMonth() + 1;

  // Calculate quarter
  const quarter = Math.ceil(month / 3);

  // Get current year
  const year = currentDate.getFullYear();

  return {
    week,
    month,
    quarter,
    year,
  };
}

/**
 * Returns the starting date of the specified week of a year
 * @param {number} w - Week number
 * @param {number} y - Year
 * @return {Date} The starting date of the specified week of the year
 * example: Mon Jul 31 2023 00:00:00 GMT+0100 (British Summer Time) if run on Thurs 3rd August
 */
function getDateOfISOWeek(year, week) {
  // Start from January 1st, then add the number of days equivalent to (week number - 1) weeks
  // new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
  // nb day has no limit will go past months and years
  let simple = new Date(year, 0, 1 + (week - 1) * 7);

  // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  let dayOfWeek = simple.getDay();

  // Calculate the start date of the week
  let weekStart = simple;
  if (dayOfWeek <= 4) {
    // If the day of the week is between Sunday (0) and Thursday (4), subtract the day number from the date to get to the start of the week (Monday)
    weekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    // If the day of the week is Friday (5) or Saturday (6), add the necessary number of days to get to the start of the next week (Monday)
    weekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return weekStart;
}

module.exports = {
  getCurrentTimeData,
  getDateOfISOWeek,
  getWeekNumbers,
  getCurrentQuarter,
};
