const moment = require("moment");

function getCurrentQuarter() {
  return moment().quarter();
}

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
function getCurrentTimeData(adjustForWeekend = false) {
  const currentDate = moment();

  // Calculate week of the year according to the ISO standard (Monday start)
  let week = currentDate.isoWeek();

  // If today is weekend and adjustForWeekend is true, adjust week number to refer to the previous week
  if (
    adjustForWeekend &&
    (currentDate.day() === 0 || currentDate.day() === 6)
  ) {
    week = week - 1;
    // If the previous week was the last week of the previous year
    if (week === 0) {
      week = 52; // or 53 depending on the year
    }
  }

  // Calculate month (1-based in Moment.js)
  const month = currentDate.month() + 1;

  // Calculate quarter
  const quarter = currentDate.quarter();

  // Get current year
  const year = currentDate.year();

  return {
    week,
    month,
    quarter,
    year,
  };
}
function getDateOfISOWeek(year, week) {
  return moment().year(year).isoWeek(week).startOf("isoWeek").toDate();
}

const isTimeToSubmit = (req, res, next) => {
  // Check if current time is within allowed timeframe
  const now = moment.utc();
  const dayOfWeek = now.isoWeekday(); // 1 (Mon) - 7 (Sun)
  const hour = now.hour(); // 0 - 23
  const minute = now.minute(); // 0 - 59

  if (
    !(
      (dayOfWeek == 5 && hour >= 23) ||
      dayOfWeek == 6 ||
      dayOfWeek == 7 ||
      (dayOfWeek == 1 && (hour < 13 || (hour == 13 && minute <= 30)))
    )
  ) {
    req.isTimeToSubmit = false;
  } else {
    req.isTimeToSubmit = true;
  }

  next();
};

module.exports = {
  getCurrentTimeData,
  getDateOfISOWeek,
  getWeekNumbers,
  getCurrentQuarter,
  isTimeToSubmit,
};
