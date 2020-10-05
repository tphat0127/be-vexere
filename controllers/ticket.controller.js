const express = require('express')
const {createTicket} = require('../services/ticket.service')
const { authenticate, authorize } = require('../midleware/auth')

const router = express.Router()

router.post('/tickets/book', authenticate, createTicket)

module.exports = router