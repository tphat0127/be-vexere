const {Ticket} = require('../models/ticket.model')
const {Seat} = require('../models/seat.model')
const {Trip} = require('../models/trip.model')
const {sendSuccessfulRegisterEmail} = require('../services/sendmail/bookTickets')

module.exports.createTicket = (req, res, next) => {
    const user = req.user
    const {tripId, seatCodes} = req.body

    Trip.findById(tripId)
        .then((trip) => {
            if(!trip) return Promise.reject({
                status: 404,
                message: 'Trip not found'
            })

            const availableSeatCodes = trip.seats
                .filter(seat => !seat.isBooked)
                .map(seat => seat.code)

            //console.log(availableSeatCodes)

            const errSeatCodes = [] //danh sach ghe loi
            seatCodes.forEach(code => {
                if(availableSeatCodes.indexOf(code) === -1 ) errSeatCodes.push(code)
            })

            if(errSeatCodes.length > 0) {
                return Promise.reject({
                    status: 404,
                    message: `Seat ${errSeatCodes.join(", ")} is not available`
                })
            }
            
            seatCodes.forEach(code => {
                const index = trip.seats.findIndex(seat => seat.code === code)
                trip.seats[index].isBooked = true //
            })

            return Promise.all([
                Ticket.create({
                    tripId, 
                    userId: user._id,
                    seats: seatCodes.map(code => new Seat({code})),
                    totalPrice: seatCodes.length * trip.price
                }),
                trip.save()
            ])
        })
        .then(result => {
            const [ticket, trip] = result //destructuring for array
            sendSuccessfulRegisterEmail()
            return res.status(200).json(ticket)
        })
        .catch(err => res.status(404).json(err))
}

