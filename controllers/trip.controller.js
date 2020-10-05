const express = require('express')
const {createTrip, getTrip, replaceTrip, deleteTrip, getTripById } = require('../services/trip.service')

const router = express.Router()

router.get('/trips', getTrip)
router.get('/trips/:tripId', getTripById)
router.post('/trips', createTrip)
router.put('/trips/:tripId', replaceTrip)
router.delete('/trips/:tripId', deleteTrip)

module.exports = router