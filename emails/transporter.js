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
    html: "<h2>You have successfully signed up. Enjoy !!</h2>"
  })
}

const sendUpdatePasswordEmail = (email, token) => {
  transporter.sendMail({
    to: email,
    from: 'vivek@oriserve.com',
    subject: 'Password reset',
    html: `<p>You requested a password reset</p><p>Click this <a href="http://localhost:${process.env.PORT}/reset-password/${token}">link</a> to set a new password.</p>`
  })
}

module.exports = {
  sendWelcomeMail,
  sendUpdatePasswordEmail
}