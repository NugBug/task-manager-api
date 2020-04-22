require("dotenv").config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "joshtanguay@gmail.com",
    subject: "Thanks for joining!",
    text: `Welcome to the app, ${name}.  Let me know what you think of you're experience.`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "joshtanguay@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}.  We hate to see you go, please let us know how we could have made your experience better.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}