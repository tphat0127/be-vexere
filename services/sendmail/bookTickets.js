const nodemailer = require('nodemailer')
const hogan = require('hogan.js')
const fs = require('fs')
const config = require('../../config')
const template = fs.readFileSync(`${__dirname}/sendSuccessfulRegisterEmail.hjs`, "utf8")
const compiledTemplate = hogan.compile(template)

module.exports.sendSuccessfulRegisterEmail = (ticket, trip, user) => {
    
    const transport = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        requireSSL: true,
        auth: {
            user: config.USER_EMAIL,
            pass: config.PASSWORD_EMAIL
        }
    }
    
    const transporter = nodemailer.createTransport(transport)
    
    const mailOptions = {
        from: config.USER_EMAIL,
        to: user.email,
        subject: "Vexere - Thông tin vé ♥",
        html: compiledTemplate.render({
            email: user.email,
            fromStation: `${trip.fromStationId.name}, ${trip.fromStationId.province}`,
            toStation: `${trip.toStationId.name}, ${trip.toStationId.province}`,
            price: trip.price,
            amount: ticket.seats.length,
            seats: ticket.seats.map(e => e.code).toString(),
            total: ticket.seats.length * trip.price
        })
    }
    console.log(mailOptions.from)
    transporter.sendMail(mailOptions, err => {
        if (err) return console.log(err)
        console.log("Email was successfully sent!")
    })
}

