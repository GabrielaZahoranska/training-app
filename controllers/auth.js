const crypto = require('crypto')
const User = require('../models/user')

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

const verifyPassword = (password, stored) => {
  const parts = stored.split(':')
  if (parts.length !== 2) return false
  const [salt, hash] = parts
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'))
  } catch {
    return false
  }
}

const renderSignUp = (req, res) => {
  res.render('auth/sign-up', { error: '' })
}

const signUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() })

    if (existingUser) {
      return res.status(400).render('auth/sign-up', { error: 'Email is already in use.' })
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).render('auth/sign-up', { error: 'Passwords do not match.' })
    }

    const hashedPassword = hashPassword(req.body.password)

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })

    req.session.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    res.redirect('/workouts')
  } catch (error) {
    res.status(400).render('auth/sign-up', { error: 'Unable to create account.' })
  }
}

const renderSignIn = (req, res) => {
  res.render('auth/sign-in', { error: '' })
}

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() })

    if (!user) {
      return res.status(400).render('auth/sign-in', { error: 'Invalid email or password.' })
    }

    const validPassword = verifyPassword(req.body.password, user.password)

    if (!validPassword) {
      return res.status(400).render('auth/sign-in', { error: 'Invalid email or password.' })
    }

    req.session.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }

    res.redirect('/workouts')
  } catch (error) {
    res.status(400).render('auth/sign-in', { error: 'Unable to sign in.' })
  }
}

const signOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

module.exports = {
  renderSignUp,
  signUp,
  renderSignIn,
  signIn,
  signOut,
}
