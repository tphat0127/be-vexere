const validator = require('validator')
const _ = require('lodash')
const {User} = require('../../models/user.model')

module.exports.validateLogin = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    var errors = {

    }
    //////////////////////////////// EMAIL //////////////////////////////////
    if(!email){
        errors.email = 'Email is required'
    } else if(!validator.isEmail(email)) {
        errors.email = 'Email is invalid'
    }
    //////////////////////////////// PASSWORD //////////////////////////////////
    
    if(!password){
        errors.password = 'Password is required'
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors)
    }
    return next()
}

// Booke ticked => send email 
// Tao email moi