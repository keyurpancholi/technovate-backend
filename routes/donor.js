const router = require('express').Router()
const donorcontroller = require("../controllers/donor")

router.post('/signup', donorcontroller.signup)

router.post("/onboarding", donorcontroller.onboarding)

module.exports = router