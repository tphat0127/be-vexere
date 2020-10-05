const nodemailer = require('nodemailer')
const hogan = require('hogan.js')
const fs = require('fs')
const config = require('../../config')

const template = fs.readFileSync(`${__dirname}/sendSuccessfulRegisterEmail.hjs`, "utf8")
const compliedTemplate = hogan.compile(template)

module.exports.sendSuccessfulRegisterEmail = () => {
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
        from: "tphat0126@gmail.com",
        to: "tphat0127@gmail.com",
        subject: "Vexere",
        html: compliedTemplate.render({
            email: "tphat0127@gmail.com",
            fromStation: "sadsad",
            toStation: "sdcdsf"
        })
    }

    transporter.sendMail(mailOptions, err => {
        if(err) return console.log(err)
        console.log("Send mail successfully")
    })
}

