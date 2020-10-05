const validator = require('validator')
const _ = require('lodash')
const {User} = require('../../models/user.model')

module.exports.validateCreateUser = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const fullName = req.body.fullName

    var errors = {

    }
    //////////////////////////////// EMAIL //////////////////////////////////
    if(!email){
        errors.email = 'Email is required'
    } else if(!validator.isEmail(email)) {
        errors.email = 'Email is invalid'
    } else {
        const user = await User.findOne({ email})
        if(user) errors.email = 'Email already exists'
    }
    //////////////////////////////// PASSWORD //////////////////////////////////
    
    if(!password){
        errors.password = 'Password is required'
    } else if(!confirmPassword) {
        errors.password = 'Confirm password is required'
    } else if(!validator.equals(password, confirmPassword)){
        errors.password = 'Password does not match'
    }
    //////////////////////////////// FULLNAME //////////////////////////////////
    if(!fullName){
        errors.password = 'Full name is required'
    }


    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors)
    }
    return next()
}

// Booke ticked => send email 
// Tao email moi