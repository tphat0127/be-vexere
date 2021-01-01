const express = require('express')
const {createTicket, getTicket, deleteTicket} = require('../services/ticket.service')
const { authenticate, authorize } = require('../midleware/auth')

const router = express.Router()

router.post('/tickets/book', authenticate, createTicket)
router.get('/tickets', getTicket)
router.delete('/tickets/:ticketId', deleteTicket)

module.exports = router