const router = require("express").Router();
const hospitalControllers = require("../controllers/hospital")

router.get('/matches', hospitalControllers.getAllMatch)

router.patch("/match", hospitalControllers.updateStatus)

router.get('/match', hospitalControllers.getSingleMatch)

router.post("/request", hospitalControllers.organMatchInitialize)

router.post('/match', hospitalControllers.createMatch)

router.post("/signup", hospitalControllers.signup)

router.post("/login", hospitalControllers.login)

module.exports = router