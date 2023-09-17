const router = require('express').Router();
const hospitalControllers = require('../controllers/hospital');

// router.get('/matches', hospitalControllers.getAllMatch)

router.patch('/match', hospitalControllers.updateStatus);

router.patch('/match/reject', hospitalControllers.rejectStatus);

router.get('/match', hospitalControllers.getSingleMatch);

router.post('/request', hospitalControllers.organMatchInitialize);

router.post('/match', hospitalControllers.createMatch);

router.post('/signup', hospitalControllers.signup);

router.post('/login', hospitalControllers.login);

router.get('/organs', hospitalControllers.getAllOrgans);

router.get('/appointments', hospitalControllers.getAppointmentsByHospital);

router.post('/appointments', hospitalControllers.makeAppointment);

router.patch('/appointments', hospitalControllers.updateAppointment);

router.get('/appointments/:id', hospitalControllers.getAppointmentsById);

module.exports = router;
