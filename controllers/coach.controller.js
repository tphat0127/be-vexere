const express = require('express');
const {uploadImage} = require('../midleware/images')
const { createCoach, getCoach, deleteCoach, getCoachById, replaceCoach, updateThumbnail } = require('./../services/coach.service');
const router = express.Router()

router.post('/coaches', createCoach);
router.get('/coaches', getCoach);
router.get('/coaches/:coachId', getCoachById)
router.put('/coaches/:coachId', replaceCoach)
router.delete('/coaches/:coachID', deleteCoach);
router.post('/coaches/:coachId/update-thumbnail', uploadImage("thumbnail"), updateThumbnail)

module.exports = router
