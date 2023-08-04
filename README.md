# S&P 500 Weekly Competition on Trade2Win

SP500 Competition is a weekly contest that is currently run on a thread in the forum. You can access the latest build [here](https://contest.trade2win.com).

## About the Project

This project uses Express.js for the server-side, EJS for the view engine and Prisma as the ORM for PostgreSQL. We use the Yahoo Finance API to fetch data. The application is hosted on Heroku.

## Installation

Install the required packages using npm:

```bash
npm install
```

## Usage

To run the application in a development environment:

```bash
npm run dev
```

To run the application in a production environment:

```bash
npm run start
```

## Database Migrations

We're using Prisma for our database migrations. Here's how you can create and apply your migrations:

```bash
npm run migrate:dev     // to create a new migration
npm run migrate:deploy  // to apply the migration
```

## Logging

This application uses Winston as its logging library, which provides a simple and configurable way to control logging levels, output formats and more. All logs in the development environment are printed to the console for ease of debugging.

In the production environment, we use Papertrail for log management. Papertrail provides a powerful interface for managing and understanding logs from different sources, making it easier to diagnose and fix issues.

## Scripts

Make sure you are running any script in the /scripts folder from the root directory of your project. If you're running it from within a sub-directory, the path to the .env file will be incorrect and the environment variables won't be loaded.

## Weekly Leaderboard Update

We have a script, `weeklyScores.js`, that updates the leaderboard once a week. This script is designed to be run by Heroku Scheduler, but it can also be run manually if necessary.

To run the script manually:

```bash
node scripts/weeklyScores.js
```

To set up the script to run automatically using Heroku Scheduler:

1. Navigate to the [Heroku dashboard](https://dashboard.heroku.com/apps), select your application, and then select "Scheduler" under "Installed add-ons".
2. Click on "Add new job".
3. In the task field, enter `node scripts/weeklyScores.js`.
4. In the frequency field, select "Every day at..." and choose 9:30pm UTC (the script itself checks that the current day is Friday before proceeding).
5. Click on "Save Job".

This will ensure the leaderboard is updated once a week on Friday.

## Hosting on Heroku

The application is hosted on Heroku and uses the PostgreSQL add-on for the database. The `Procfile` includes instructions for running migrations and seeding the database whenever a new release is deployed:

```
release: npx prisma migrate deploy && node database/seed.js
web: npm start
```

## To-Do List

Please read the [Tasks Simple List](./TASKS-SIMPLE.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
