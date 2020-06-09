const crypto = require('crypto')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { sendWelcomeMail } = require('../emails/transporter')

exports.getSignup = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword
  const cart = { products: [] }
  try {
    const user = await User.findOne({ email })
    if (user) {
      req.flash('error', 'email already occupied.');
      return res.redirect('/signup')
    }
    if (!password || password !== confirmPassword) {
      req.flash('error', 'password and confirm password shoould be same.');
      return res.redirect('/signup')
    }
    const hashPassword = await bcrypt.hash(password, 8)
    const newUser = new User({ email, password: hashPassword, cart })
    await newUser.save()
    sendWelcomeMail(newUser.email)
    res.redirect('/login')
  } catch (err) {
    console.log('Error', err)
    req.flash('error', 'Something went wrong.');
    res.redirect('/signup')
  }
}

exports.getLogin = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage
  });
};

exports.postLogin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    req.flash('error', 'Invalid email/password.')
    return res.redirect('/login')
  }
  const user = await User.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      req.flash('error', 'Invalid email/password.')
      return res.redirect('/login')
    }
    req.session.user = user
    req.session.isLoggedIn = true
    await req.session.save()
    res.redirect('/')
  } else {
    req.flash('error', 'Profile not found please signup first')
    res.redirect('/login');
  }
}

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

exports.getResetPassword = async (req, res) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  res.render('auth/reset-password', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage
  });
}

exports.postResetPassword = async (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/login')
    }
  })
}