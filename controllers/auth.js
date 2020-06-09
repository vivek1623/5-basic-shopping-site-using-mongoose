const crypto = require('crypto')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { sendWelcomeMail, sendUpdatePasswordEmail } = require('../emails/transporter')

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

exports.getResetPassword = (req, res) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  res.render('auth/reset-password', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage
  });
}

exports.postResetPassword = async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    try {
      if (err) {
        console.log(err)
        req.flash('error', 'Something went wrong')
        return res.redirect('/reset-password')
      }
      const token = buffer.toString("hex")
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        req.flash('error', 'No account with that email found.')
        return res.redirect('/reset-passsword')
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save()
      res.redirect('/')
      sendUpdatePasswordEmail(user.email, token)
    } catch (err) {
      console.log(err)
      req.flash('error', 'Something went wrong')
      return res.redirect('/reset-password')
    }
  })
}

exports.getUpdatePassword = async (req, res) => {
  try {
    const token = req.params.token
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    if (!user) {
      req.flash('error', 'Token is invalid/Expired')
      return res.redirect('/login')
    }
    const message = req.flash('error');
    const errorMessage = message.length > 0 ? message[0] : null
    res.render('auth/update-password', {
      path: '/update-password',
      pageTitle: 'Update Password',
      errorMessage,
      userId: user._id.toString(),
      passwordToken: token
    });
  } catch (err) {
    console.log(err)
    req.flash('error', 'Something went wrong')
    return res.redirect('/login')
  }
}

exports.postUpdatePassword = async (req, res) => {
  try {
    const newPassword = req.body.newPassword
    const confirmPassword = req.body.confirmPassword
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    if (newPassword !== confirmPassword) {
      req.flash('error', 'Password and Confirm Password must be same')
      return res.redirect('/login')
    }
    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() }
    })
    if (!user) {
      req.flash('error', 'Token is invalid/Expired')
      return res.redirect('/login')
    }
    const hashPassword = await bcrypt.hash(newPassword, 8)
    user.password = hashPassword
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
    res.redirect('/login')
  } catch (err) {
    console.log(err)
    req.flash('error', 'Something went wrong')
    return res.redirect('/login')
  }
}