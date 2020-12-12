const express = require('express');
const { createCoach, getCoach } = require('./../services/coach.service');
const router = express.Router()

router.post('/coachs', createCoach);
router.get('/coachs', getCoach);

module.exports = router