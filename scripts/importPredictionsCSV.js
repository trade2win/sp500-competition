// Import required modules
const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");
const { getDateOfISOWeek } = require("../services/dateHelpers.js");

// Create a Prisma client
const prisma = new PrismaClient();

// Create a readable stream from the CSV file
const stream = fs.createReadStream("import.csv").pipe(csv());

// Listen to the 'data' event on the stream, which fires whenever a new row is read from the CSV
stream.on("data", async (row) => {
  // Pause the data reading to process current row
  stream.pause();

  try {
    // Destructure the row into 'xenforo_id', 'username', and 'predictions' variables
    const { xenforo_id, username, ...predictions } = row;

    // Upsert the user in the database. This will update the user if they already exist or create a new user if they don't.
    const user = await prisma.user.upsert({
      where: { xenforo_id: Number(xenforo_id) },
      update: { username },
      create: { xenforo_id: Number(xenforo_id), username },
    });

    // Loop through each prediction for the user
    for (const weekYear in predictions) {
      // Split the weekYear key into week and year
      const [week, year] = weekYear.split("_");

      // Validate year and week values
      if (isNaN(year) || isNaN(week)) {
        console.log(`Invalid year or week: year=${year}, week=${week}`);
        continue;
      }

      const weekNumber = Number(week);
      const yearNumber = Number(year);

      // If there's a prediction for the week, process it
      if (predictions[weekYear]) {
        // Fetch the close price for the previous week from the priceHistory table
        const previousWeekClose = await prisma.weeklyPriceHistory.findFirst({
          where: { week: weekNumber - 1, year: yearNumber },
          select: { close: true },
          orderBy: { date: "desc" },
        });

        // If there's no data for the previous week, skip to the next prediction
        if (!previousWeekClose) {
          console.log(
            `No price history data for week ${
              weekNumber - 1
            } of year ${yearNumber}`
          );
          continue;
        }

        // Calculate direction based on the previous week's close price and the current prediction
        const prediction = Number(predictions[weekYear]);
        const direction = prediction >= previousWeekClose.close ? 1 : -1;

        // Upsert the prediction in the database
        await prisma.prediction.upsert({
          where: {
            user_week_year_uidx: {
              user_id: user.id,
              week: weekNumber,
              year: yearNumber,
            },
          },
          update: { prediction, direction },
          create: {
            user_id: user.id,
            prediction,
            week: weekNumber,
            year: yearNumber,
            direction,
          },
        });
      }
    }
  } catch (error) {
    // Log any error that occurs while processing a row
    console.error("Error processing row: ", error);
  } finally {
    // Resume the data reading once current row is processed
    stream.resume();
  }
});

// Listen to the 'end' event on the stream, which fires when the entire CSV has been read
stream.on("end", () => {
  console.log("CSV file successfully processed");
});
