const { Station } = require('../models/station.model')

// GET /api/stations
module.exports.getStations = (req, res, next) => {
    return Station.find()
        .then(stations => {
            return res.status(200).json(stations)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}

//POST /api/stations
module.exports.createStation = (req, res, next) => {
    const {name, address, province} = req.body
    return Station.create({name, address, province})
        .then(station => {
            return res.status(201).json(station)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
}

//PUT /api/stations/:stationID
module.exports.replaceStation = (req, res, next) => {
    const {stationId} = req.params;
    
    return Station.findById(stationId)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404,
                message: "Station not found"
            })
            Object
                .keys(Station.schema.obj)
                .forEach(key => {
                station[key] = req.body[key]
            })

            return station.save()
        })
        .then(station => res.status(200).json(station))
        .catch(err => res.status(500).json(err))
       
}

/// WRITE PATH METHOD
//only update record when typed <Resful API>
module.exports.updateStation = (req, res, next) => {
    const {stationId} = req.params;
    
    return Station.findById(stationId)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404,
                message: "Station not found"
            })
            Object
                .keys(req.body)
                .forEach(key => {
                station[key] = req.body[key]
            })
            console.log(Object.keys(req.body))
            return station.save()
        })
        .then(station => res.status(200).json(station))
        .catch(err => res.status(500).json(err))
       
}

// GET by id api/stations/:id
module.exports.getStationById = (req, res, next) => {
    const {stationId} = req.params

    Station.findById(stationId)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404,
                message: "Station not found"
            })

            return res.status(200).json(station)
        })
        .catch(err => res.status(404).json(err))
}
// DELETE api/stations/:id
module.exports.deleteStation = (req, res, next) => {
    const {stationId} = req.params
    let _station;
    Station.findById(stationId)
        .then(station => {
            if(!station) return Promise.reject({
                status: 404,
                message: "Station not found"
            })
            _station = station
            return station.deleteOne()
        })
        .then(() => res.status(200).json(_station))
        .catch(err => res.status(404).json(err))
}