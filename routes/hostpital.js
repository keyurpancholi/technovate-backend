const router = require("express").Router();
const hospitalControllers = require("../controllers/hospital")

router.get('/matches', hospitalControllers.getAllMatch)

router.patch("/match", hospitalControllers.updateStatus)

router.get('/match', hospitalControllers.getSingleMatch)

module.exports = router