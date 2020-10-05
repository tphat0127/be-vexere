const mongoose = require('mongoose')

const SeatSchema = new mongoose.Schema({
    code: {type: String},
    isBooked: {type: Boolean} //true: booked
})

const Seat = mongoose.model('Seat', SeatSchema, 'Seat')

module.exports = {
    SeatSchema,
    Seat
}
