const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
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
      return res.redirect('/signup')
    }
    if (!password || password !== confirmPassword) {
      return res.redirect('/signup')
    }
    const hashPassword = await bcrypt.hash(password, 8)
    const newUser = new User({ email, password: hashPassword, cart })
    await newUser.save()
    res.redirect('/login')
  } catch (err) {
    console.log('Error', err)
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