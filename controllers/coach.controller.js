const express = require('express');
const { createCoach, getCoach, deleteCoach, getCoachById, replaceCoach } = require('./../services/coach.service');
const router = express.Router()

router.post('/coaches', createCoach);
router.get('/coaches', getCoach);
router.get('/coaches/:coachId', getCoachById)
router.put('/coaches/:coachId', replaceCoach)
router.delete('/coaches/:coachID', deleteCoach);

module.exports = router
