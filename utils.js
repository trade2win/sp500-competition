function getCurrentTimeData() {
  const currentDate = new Date();

  // Week of the year
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const weekOfYear =
    Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24 * 7)) + 1;

  // Week of the month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const weekOfMonth =
    Math.floor((currentDate - startOfMonth) / (1000 * 60 * 60 * 24 * 7)) + 1;

  // Month (0-based in JavaScript, so adding 1 to make it 1-based)
  const month = currentDate.getMonth() + 1;

  // Year
  const year = currentDate.getFullYear();

  return {
    weekOfYear,
    weekOfMonth,
    month,
    year,
  };
}

module.exports = {
  getCurrentTimeData,
};
