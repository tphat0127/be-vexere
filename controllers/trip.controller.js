const express = require('express')
const {createTrip, getTrip, replaceTrip, deleteTrip, getTripById, searchTrips } = require('../services/trip.service')

const router = express.Router()

router.get('/trips', getTrip)
router.get('/trips/:tripId', getTripById)
router.get('/trips/:fromStationId/:toStationId', searchTrips);
router.post('/trips', createTrip)
router.put('/trips/:tripId', replaceTrip)
router.delete('/trips/:tripId', deleteTrip)

module.exports = router