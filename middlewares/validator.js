const { check, body } = require('express-validator/check')

const User = require('../models/user')

const signup = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
      if (user)
        return Promise.reject('E-Mail exists already, please pick a different one.')
      return true
    }).normalizeEmail(),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error('Passwords have to match!')
      return true
    })
]

const login = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
]

module.exports = {
  signup,
  login
}