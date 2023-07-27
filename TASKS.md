# Task List of Project

This document outlines the tasks and milestones for the project. It provides an overview of the work to be completed, the status of each task, and any additional notes or instructions.

### Task 1: Set Up Express.js, EJS, and PostgreSQL Integration

- **Description:** Configure the Node.js backend with Express.js, EJS templating engine, and integrate PostgreSQL for data storage.
- **Subtasks:**
  - [x] ~~Set up a Node.js project with Express.js framework~~
  - [x] ~~Configure EJS as the templating engine for rendering views~~
  - [x] Connect the application to a Sqlite database
  - [x] Implement necessary database schemas and models
- **Notes:** The backend will be built using JavaScript, Node.js, Express.js, EJS, and PostgreSQL.

### Task 2: Implement User Authentication with OAuth

- **Description:** Implement user authentication using the OAuth API provided by [trade2win](https://www.trade2win.com).
- **Subtasks:**
  - [x] Integrate OAuth authentication with trade2win API
  - [x] Set up user login functionality
  - [x] Manage user sessions and authentication state
- **Notes:** User authentication will be required for participaiting in the contest.

### Task 3: Design the website (sitemap of pages, template, pages)

- **Description:** Define and design the website, providing an overview of the competition and displaying current predictions and leaderboard rankings.
- **Subtasks:**
  - [x] Create a visually appealing and intuitive user interface for the homepage
  - [ ] Implement the dynamic display of current predictions and leaderboard rankings
  - [ ] Ensure responsiveness across different devices and screen sizes

### Task 4: Allow Users to Enter S&P500 Predictions

- **Description:** Develop functionality for users to enter their predictions for the S&P500 index close at the end of the week.
- **Subtasks:**
  - [x] Create input form for users to submit their predictions
  - [ ] Implement validation to ensure predictions fall within the specified time window
  - [x] Store user predictions in database
- **Notes:** Users can only enter predictions between the close on Friday and the open on Monday before the predicted Friday close.

### Task 5: Real-time Update of Leaderboard and S&P500 Index

- **Description:** Update the leaderboard and S&P500 index values in real-time on the homepage.
- **Subtasks:**
  - [ ] Retrieve real-time S&P500 index data from a reliable source
  - [ ] Implement logic to update leaderboard based on current S&P500 index values
  - [ ] Display leaderboard and S&P500 index updates on the homepage
- **Notes:** Leaderboard rankings should reflect the current value of the S&P500 index.

### Task 6: Points Calculation and Yearly Leaderboard

- **Description:** Calculate and display points for each week's contest, and maintain a yearly leaderboard of total points.
- **Subtasks:**
  - [ ] Determine the closest predictions to the actual S&P500 index close each week
  - [ ] Assign points to users based on prediction accuracy
  - [ ] Store points and leaderboard data in a PostgreSQL database
  - [ ] Update and display the leaderboard for the current year
- **Notes:** At the end of the year, the user with the most points wins a prize. Each year will start afresh.
