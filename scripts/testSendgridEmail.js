require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text) {
  let points = 10;
  let medals = "gold";
  let user = { username: "Sharky" };
  const msg = {
    to,
    from: "support@trade2win.com", // Your verified sender
    subject,
    text: `Hi ${user.username},\n\nYour points this week: ${points}\nYour medals: ${medals}\n\nSubmit your predictions for next week now!\n\nThanks,\nThe Team`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendEmail("pagould@gmail.com", "Your Weekly Scores and Medals", "");
