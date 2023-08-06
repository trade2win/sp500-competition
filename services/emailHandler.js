const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const logger = require("../logger");

function sendEmail(to, subject, text, html) {
  const msg = {
    to, // recipient email
    from: "support@trade2win.com", // sender email
    subject,
    text,
    html,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((error) => {
      logger.info("Error sending email:", error);
    });
}

module.exports = {
  sendEmail,
};
