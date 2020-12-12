const dotenv = require('dotenv');

const envPath = __dirname + `/../.env.${process.env.NODE_ENV}`
dotenv.config({path: envPath})

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL
const USER_EMAIL = process.env.EMAIL_USER
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

module.exports = {
    DB_URL,
    PORT,
    USER_EMAIL,
    PASSWORD_EMAIL,
    JWT_SECRET_KEY
}
