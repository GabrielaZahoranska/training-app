const express = require('express')
const authController = require('../controllers/auth')

const router = express.Router()

router.get('/sign-up', authController.renderSignUp)
router.post('/sign-up', authController.signUp)
router.get('/sign-in', authController.renderSignIn)
router.post('/sign-in', authController.signIn)
router.get('/sign-out', authController.signOut)

module.exports = router
