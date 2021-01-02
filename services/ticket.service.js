const {Ticket} = require('../models/ticket.model')
const {Seat} = require('../models/seat.model')
const {Trip} = require('../models/trip.model')
const {sendSuccessfulRegisterEmail} = require('../services/sendmail/bookTickets')

module.exports.getTicket = (req, res, next) => {
    return Ticket.find()
		.populate('userId')
        .populate({
			path: 'tripId',
			populate: { path: 'fromStationId' }
		})
		.populate({
			path: 'tripId',
			populate: { path: 'toStationId' }
		})
		.populate({
			path: 'tripId',
			populate: { path: 'coachId' }
		})
        .then(ticket => res.status(201).json(ticket))
        .catch(err => res.status(400).json(err))
}

module.exports.deleteTicket = (req, res, next) => {
    const {ticketId} = req.params
	
    let _ticket
    return Ticket.findById(ticketId)
        .then(ticket => {
            if(!ticket) return Promise.reject({
                message: "ticket not found",
                status: 404
            })
			//const seatList = ticket.seats
			ticket.seats.map(x => {
			console.log(x._id)
				Seat.findById(x._id)
					.then(s => {
						if(!s) return Promise.reject({
							status: 404,
							message: 'Trip not found'
						})
					})
					.catch(err => res.status(500).json(err));
			});
            _ticket = ticket
            return 0//ticket.deleteOne()
        })
        .then(() => res.status(200).json(_user))
        .catch(err => res.status(500).json(err))
}

module.exports.createTicket = (req, res, next) => {
    const user = req.user
    const {tripId, seatCodes} = req.body
    console.log(tripId, seatCodes);
    Trip.findById(tripId)
        .then((trip) => {
            if(!trip) return Promise.reject({
                status: 404,
                message: 'Trip not found'
            })

            const availableSeatCodes = trip.seats
                .filter(seat => !seat.isBooked)
                .map(seat => seat.code)

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

