require('dotenv').config()

const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')

const authRoutes = require('./routes/auth')
const workoutRoutes = require('./routes/workouts')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

mongoose.connect(process.env.MONGODB_URI)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  })
)

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user
  next()
})

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/auth', authRoutes)
app.use('/workouts', workoutRoutes)

app.use((req, res) => {
  res.status(404).render('not-found')
})

const port = process.env.PORT || 3000
app.listen(port)
