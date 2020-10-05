const jwt = require('jsonwebtoken')
const util = require('util')
const config = require('../../config')

const jwtVerify = util.promisify(jwt.verify)

module.exports.authenticate = (req, res, next) => {
    const token = req.headers.token
    jwtVerify(token, config.JWT_SECRET_KEY)
        .then(decoded => {
            if(!decoded) return res.status(401).json({
                message: "Token is invalid"
            })
            req.user = decoded
            console.log()
            return next()
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

module.exports.authorize = userTypeArray => (req, res, next) => {
    const user = req.user
    if(userTypeArray.indexOf(user.userType) > -1) return next()

    return res.status(403).json({
        message: "You don't have permission'"
    })
}