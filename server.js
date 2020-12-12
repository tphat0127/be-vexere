const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')

const stationController = require('./controllers/station.controller')
const tripController = require('./controllers/trip.controller')
const userController = require('./controllers/user.controller')
const ticketController = require('./controllers/ticket.controller')
const coachController = require('./controllers/coach.controller')

mongoose.connect(config.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(console.log(`Connect to mongodb successfully`))
    .catch(console.log)

const app = express();

app.use(express.json())
app.use("/images", express.static("images"))

app.use('/api', stationController)
app.use('/api', tripController)
app.use('/api', userController)
app.use('/api', ticketController)
app.use('/api', coachController)

app.listen(config.PORT, () => {
    console.log(`App is running in ${config.PORT}`)
})

