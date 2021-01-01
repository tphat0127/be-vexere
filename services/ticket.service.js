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

module.exports.deleteTicket = async (req, res, next) => {
    try {
      const ticket = await Ticket.findOneAndDelete({
        _id: req.params.ticketId,
      });
      if (!ticket) return res.status(404).json({ message: "Can not delete. Ticket not found" });
      const trip = await Trip.findById(ticket.tripId);
      if (!trip) return res.status(406).json({ message: "Trip not found" });
      trip.seats.map((seat) => {
        ticket.seats.map((ticket) => {
          if (ticket.code === seat.code) {
            seat.isBooked = false;
          }
        });
      });
      await trip.save();
      return res.status(200).send({ message: "Delete ticket successfully", ticket });
    } catch (e) {
      res.status(500).send(e);
    }
  };

module.exports.createTicket = (req, res, next) => {
const { tripId, seatCodes } = req.body;
const userId = req.user._id; 

Trip.findById(tripId)
    .populate("fromStation")
    .populate("toStation")
    .then((trip) => {
    if (!trip) return Promise.reject({ status: 404, message: "Trip not found" });
    const availableSeatCodes = trip.seats.filter((s) => !s.isBooked).map((s) => s.code);
    let errorSeatCodes = [];

    seatCodes.forEach((code) => {
        if (availableSeatCodes.indexOf(code) === -1) errorSeatCodes.push(code);
    });

    if (errorSeatCodes.length > 0)
        return Promise.reject({
        status: 400,
        message: "Seats are not available",
        notAvailableSeats: errorSeatCodes,
        });

    const newTicket = new Ticket({
        tripId,
        userId,
        seats: seatCodes.map((seat) => ({
        code: seat,
        isBooked: true
        })),
        totalPrice: trip.price * seatCodes.length,
    });
    trip.seats = trip.seats.map((seat) => {
        if (seatCodes.indexOf(seat.code) > -1) {
        seat.isBooked = true;
        }
        return seat;
    });
    return Promise.all([newTicket.save(), trip.save()]);
    })

    .then((result) => {
    // sendBookingTicketEmail(result[0], result[1], req.user);
    res.status(200).json(result[0]);
    })
    .catch((err) => res.status(500).json(err));
};
