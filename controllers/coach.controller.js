const express = require('express');
const { createCoach, getCoach, deleteCoach } = require('./../services/coach.service');
const router = express.Router()

router.post('/coaches', createCoach);
router.get('/coaches', getCoach);
router.delete('/coaches/:coachID', deleteCoach);

module.exports = router
