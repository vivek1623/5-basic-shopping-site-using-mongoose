const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = async (req, res) => {
  const user = await User.findOne()
  if (user) {
    req.session.user = user
    req.session.isLoggedIn = true
    res.redirect('/')
  } else {
    res.redirect('/login');
    console.log('User not found')
  }
}