const {Trip} = require('../models/trip.model')
const {Seat} = require('../models/seat.model')

const seatCodeArr = [
    "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "A12",
    "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12",
]

// GET /api/trip
module.exports.getTrip = (req, res, next) => {
    return Trip.find()
        .then(trips => {
            return res.status(200).json(trips)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}

// GET by id api/trip/:id
module.exports.getTripById = (req, res, next) => {
    const {tripId} = req.params

    Trip.findById(tripId)
        .then(trip => {
            if(!trip) return Promise.reject({
                status: 404,
                message: "Trip not found"
            })

            return res.status(200).json(trip)
        })
        .catch(err => res.status(404).json(err))
}

//POST /api/trip
module.exports.createTrip = (req, res, next) => {
    const seats = seatCodeArr.map((code) =>{
        return new Seat({
            code,
            isBooked: "false"
        })
    })
    const {fromStationId, toStationId, startTime, price} = req.body
    return Trip.create({fromStationId, toStationId, startTime, price, seats})
        .then(trip => {
            return res.status(201).json(trip)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}

//PUT /api/trips/:tripId
module.exports.replaceTrip = (req, res, next) => {
    const {tripId} = req.params;
    
    return Trip.findById(tripId)
        .then(trip => {
            if(!trip) return Promise.reject({
                status: 404,
                message: "Trip not found"
            })
            Object
                .keys(Trip.schema.obj)
                .forEach(key => {
                trip[key] = req.body[key]
            })

            return trip.save()
        })
        .then(trip => res.status(200).json(trip))
        .catch(err => res.status(500).json(err))
}

// DELETE api/trip/:id
module.exports.deleteTrip = (req, res, next) => {
    const {tripId} = req.params
    let _trip;
    Trip.findById(tripId)
        .then(trip => {
            if(!trip) return Promise.reject({
                status: 404,
                message: "Trip not found"
            })
            _trip = trip
            return trip.deleteOne()
        })
        .then(() => res.status(200).json(_trip))
        .catch(err => res.status(404).json(err))
}