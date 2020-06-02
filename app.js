const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')

const publicDirPath = path.join(__dirname, 'public')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(publicDirPath))

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/admin', adminRouter)
app.use(shopRouter)

app.use((req, res, next) => {
  res.render('404', {
    pageTitle: '404',
    path: '/404'
  })
})

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected')
  app.listen(process.env.PORT, () => {
    console.log(`server is up on port ${process.env.PORT}`)
  })
}).catch(err => {
  console.log('Database connection failed', err);
})

