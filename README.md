# S&P 500 Weekly Competition on Trade2Win

SP500 Competition is a weekly contest that is currently run on a thread in the forum, the latest one for 2023 is available in [this thread](https://www.trade2win.com/threads/s-p500-weekly-predictioning-competition-for-2023.241639/).

You can access the latest build here: (https://sp500-contest-59ea8f845b9d.herokuapp.com/).

Nice bootstrap templates here:
https://adminlte.io/blog/free-bootstrap-5-templates/

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev // dev environment
npm run start  // live production environment
```

## ORM

We'll use Prisma as our ORM, if not we could use Sequelize. Or just vanilla sql. With an ORM we can easily store migrations in git and switch from sqlite to postgres.

## Testing

We're using [jest](https://jestjs.io/) for unit testing. In futurure can be used also
for integration tests, mock functions, timer mocks.
In future we might use [cypress](https://www.cypress.io/) for end to end testing.

```bash
npm test
```

## To-DO List

Please read the [Tasks List](./TASKS.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
