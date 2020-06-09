const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY
    }
  })
)

const sendWelcomeMail = email => {
  transporter.sendMail({
    to: email,
    from: 'vivek@oriserve.com',
    subject: 'Signup succeeded!',
    text: "<h2>You have successfully signed up. Enjoy !!</h2>"
  })
}

module.exports = {
  sendWelcomeMail
}