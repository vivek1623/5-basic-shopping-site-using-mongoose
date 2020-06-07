const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')
const csrf = require('csurf')

const User = require('./models/user')

const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const authRouter = require('./routes/auth')

const errorControllers = require('./controllers/error')

const publicDirPath = path.join(__dirname, 'public')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions"
})

const csrfProtection = csrf()

app.use(express.static(publicDirPath))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use(csrfProtection)

app.use(flash())

app.use(async (req, res, next) => {
  if (!(req.session.user && req.session.user._id))
    return next()
  const user = await User.findById(req.session.user._id)
  if (user) {
    req.user = user
    next()
  } else {
    res.send('User not found')
    console.log('User not found')
  }
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRouter)
app.use(shopRouter)
app.use(authRouter)

app.use(errorControllers.get404Page)

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Database connected')
  app.listen(process.env.PORT, () => {
    console.log(`server is up on port ${process.env.PORT}`)
  })
}).catch(err => {
  console.log('Database connection failed', err)
})

