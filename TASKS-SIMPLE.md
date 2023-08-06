# Project Plan for Stock Market Prediction Contest Platform

TODO

Next steps

- Apply security enhacements
  // secret: process.env.SESSION_SECRET || "watermelon", // Use an environment variable for production
  //secure: app.get("env") === "production", // Set secure only in production
- Remove the need to put in git password twice on each commit
- Add email to user table
- Improve formatting of the weekly results email
- Fix the formatting of the dropdown on mobile screens

Nice to Haves

- If there's a problem getting the S&P500 price from yahoo then dont break the page, also cache this for at least a minute during market hours

- Add avatars
- Automate T2W_Bot predictions by averaging the results, we'll need a weekly scheduled script to run to take all the predictions, average them and submit it.
- Fix the mobile version
- Show the cumulative score for the quarter
- Logo for the site
- About us, contact us and T&C pages
- Improve the scheduling currently we use heroku simple scheduling but it's only UTC time more advanced
  would be https://devcenter.heroku.com/articles/scheduled-jobs-custom-clock-processes
  [competition thread](https://www.trade2win.com/threads/
- any maintenance tasks or scripts that need to be run on a schedule (like your weeklyScores.js), you might want to consider running them as scheduled GitHub Actions instead of, or in addition to, using Heroku Scheduler. This can sometimes be more flexible and provide better logging and error handling.

DONE

- manage sessions on postgres (maybe connect-pg-simple)
- Tidy up the github repo to make it ready to share
- Link back to the thread on T2W
- Fix the dropdown it stopped working, also the links to
- Remove the Me
- We need to accept predictions only between certain days/times
  - also need to check if you've already made a prediction and make sure
- Mobile menu isn't in white and the table doesn't offer a scroller
- redirect to ssl
- Schedule the processing of scores at end of week
