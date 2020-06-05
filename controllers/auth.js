const bcrypt = require('bcrypt')
const User = require('../models/user')

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
    res.redirect('/login')
  } catch (err) {
    console.log('Error', err)
    req.flash('error', 'Something went wrong.');
    res.redirect('/signup')
  }
}

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    return res.redirect('/login')
  }
  const user = await User.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.redirect('/login')
    }
    req.session.user = user
    req.session.isLoggedIn = true
    await req.session.save()
    res.redirect('/')
  } else {
    res.redirect('/login');
    console.log('User not found')
  }
}

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}