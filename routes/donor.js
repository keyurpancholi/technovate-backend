const router = require('express').Router()
const donorcontroller = require("../controllers/donor")

router.post('/signup', donorcontroller.signup)

router.post("/onboarding", donorcontroller.onboarding)

router.post('/recipientList', donorcontroller.getRecipientList)

router.post('/login', donorcontroller.login)

router.get('/donors', donorcontroller.getAllDonors)

router.post('/donor', donorcontroller.getDonorById)

router.patch("/organ", donorcontroller.changeOrgan)

module.exports = router