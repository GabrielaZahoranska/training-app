require('dotenv').config()

const express = require('express')
const session = require('express-session')
const { MongoStore } = require('connect-mongo')
const methodOverride = require('method-override')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

const authRoutes = require('./routes/auth')
const workoutRoutes = require('./routes/workouts')

const app = express()

mongoose.connect(process.env.MONGODB_URI)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
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
