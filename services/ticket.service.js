const { Ticket } = require("../models/ticket.model");
const { Seat } = require("../models/seat.model");
const { Trip } = require("../models/trip.model");
const { sendSuccessfulRegisterEmail } = require("./sendmail/bookTickets");

module.exports.getTicket = (req, res, next) => {
  return Ticket.find()
    .populate("userId")
    .populate({
      path: "tripId",
      populate: { path: "fromStationId" },
    })
    .populate({
      path: "tripId",
      populate: { path: "toStationId" },
    })
    .populate({
      path: "tripId",
      populate: { path: "coachId" },
    })
    .then((ticket) => res.status(201).json(ticket))
    .catch((err) => res.status(400).json(err));
};
module.exports.deleteTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: ticketId,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    const trip = await Trip.findById(ticket.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    trip.seats.map((seat) => {
      ticket.seats.map((ticket) => {
        if (ticket.code === seat.code) {
          seat.isBooked = false;
        }
      });
    });
    await trip.save();
    return res
      .status(200)
      .send({ message: "Delete ticket successfully", ticket });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports.createTicket = (req, res, next) => {
  const user = req.user;
  const { tripId, seatCodes } = req.body;
  Trip.findById(tripId)
    .populate("fromStationId")
    .populate("toStationId")
    .then((trip) => {
      if (!trip)
        return Promise.reject({
          status: 404,
          message: "Trip not found",
        });

      const availableSeatCodes = trip.seats
        .filter((seat) => !seat.isBooked)
        .map((seat) => seat.code);

      const errSeatCodes = []; //danh sach ghe loi
      seatCodes.forEach((code) => {
        if (availableSeatCodes.indexOf(code) === -1) errSeatCodes.push(code);
      });

      if (errSeatCodes.length > 0) {
        return Promise.reject({
          status: 404,
          message: `Seat ${errSeatCodes.join(", ")} is not available`,
        });
      }

      seatCodes.forEach((code) => {
        const index = trip.seats.findIndex((seat) => seat.code === code);
        trip.seats[index].isBooked = true; //
      });

      return Promise.all([
        Ticket.create({
          tripId,
          userId: user._id,
          seats: seatCodes.map((code) => new Seat({ code })),
          totalPrice: seatCodes.length * trip.price,
        }),
        trip.save(),
      ]);
    })
    .then((result) => {
      const [ticket, trip] = result; //destructuring for array
      sendSuccessfulRegisterEmail(ticket, trip, req.user);
      return res.status(200).json(ticket);
    })
    .catch((err) => res.status(500).json(err));
};
