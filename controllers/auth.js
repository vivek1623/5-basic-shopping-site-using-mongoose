const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = async (req, res) => {
  const user = await User.findById("5ed69a0656a71432609031f6")
  if (user) {
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