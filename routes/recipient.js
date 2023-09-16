const router = require('express').Router()
const recipientController = require('../controllers/recipient')

router.post('/signup', recipientController.signup)

router.post('/onboarding', recipientController.onboarding)

module.exports = router 