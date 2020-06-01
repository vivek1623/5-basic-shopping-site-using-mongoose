const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const publicDirPath = path.join(__dirname, 'public')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(publicDirPath))

app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.render('404', {
    pageTitle: '404',
    path: '/404'
  })
})

app.listen(process.env.PORT, () => {
  console.log(`server is up on port ${process.env.PORT}`)
})