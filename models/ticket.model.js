const mongoose = require('mongoose');
const { SeatSchema } = require('./seat.model');

const TicketSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    seats: [SeatSchema],
    totalPrice: {type: Number} 
//Normalizaton vs.  ^^^Denormalization^^^
})

const Ticket = mongoose.model('Ticket', TicketSchema, 'Ticket')

module.exports = {
    TicketSchema,
    Ticket
}
