const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const util = require('util') // => callback to promise. use in line 105
const config = require('../config')

const  {User} = require('../models/user.model')

const jwtSign = util.promisify(jwt.sign)

//GET /api/users/
module.exports.getUser = (req, res, next) => {
    return User.find()
        .then(user => res.status(201).json(user))
        .catch(err => res.status(400).json(err))
}

//GET api/users/:id
module.exports.getUserById = (req, res, next) => {
    const {userId} = req.params
    User.findById(userId)
        .then(user => {
            if(!user) return Promise.reject({
                status: 404,
                message: "User not found"
            })

            return res.status(201).json(user)
        })
        .catch(err => res.status(500).json(err))
}


//POST api/users
module.exports.createUser = (req, res, next) => {
    const {email, password, fullName, userType} = req.body

    //validation email

    User.create({email, password, fullName, userType}) 
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
}

//PUT api/users/:id
module.exports.replaceUser = (req, res, next) => {
    const {userId} = req.params
    return User.findById(userId)
        .then(user => {
            if(!user) return Promise.reject({
                message: "User not found",
                status: 404
            })

            Object
                .keys(User.schema.obj)
                .forEach(key => user[key] = req.body[key])
            
            return user.save()
        })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
}

//DELETE api/users/:id
module.exports.deleteUser = (req, res, next) => {
    const {userId} = req.params
    let _user
    return User.findById(userId)
        .then(user => {
            if(!user) return Promise.reject({
                message: "User not found",
                status: 404
            })
            _user = user
            return user.deleteOne()
        })
        .then(() => res.status(200).json(_user))
        .catch(err => res.status(500).json(err))
}
// POST api/users/login
module.exports.login = (req, res, next) => {
    const {email, password} = req.body
    let _user
    User.findOne({email})
        .then(user => {
            if(!user) return Promise.reject({
                status: 404,
                message: "User not found"
            })
            _user = user
            return bcrypt.compare(password, user.password) //=> true/false == isMatched
        })
        .then(isMatched => {
            if(!isMatched) return Promise.reject({
                status: 404,
                message: "Password incorrect"
            })

            const payload = {
                _id: _user._id,
                email: _user.email,
                userType: _user.userType,
                fullName: _user.fullName,
				avatarUrl: _user.avatarUrl
            }
            return jwtSign(
                payload,
                config.JWT_SECRET_KEY,
                {expiresIn: "1h"},
            )
        })
        .then(token => {
            return res.status(200).json({message: "Login successfully", token: token})
        })
        .catch(err => res.status(400).json(err))
}
///PATCH api/users/update-pwd
module.exports.updatePassword = ( req, res, next) => {
    const {email, oldPassword, newPassword} = req.body
    let _user;
    User.findOne({email})
        .then(user => {
            if(!user) return Promise.reject({
                status: 404,
                message: "User not found"
            })
            
            _user = user
            return bcrypt.compare(oldPassword, user.password) //=> true/false == isMatched
        })
        .then(isMatched => {
            if(!isMatched) return Promise.reject({
                status: 404,
                message: "Password incorrect"
            })
            _user.password = newPassword
            return _user.save()
        })
        .then(() => res.status(200).json({message: "Change password successfully"}))
        .catch(err => res.status(400).json(err))
}

//
module.exports.getMe =  (req, res, next) => {
    res.status(200).json(req.user)
}


//UPLOAD api/user/upload-avatar
module.exports.uploadAvatar = (req, res, next) => {
    //const { user } = req
    User.findById(req.user._id)
        .then(user =>{
            if(!user) return Promise.reject({
                message: "User not found"
            })
            user.avatarUrl = `${req.file.fieldname}s/${req.file.filename}`
            console.log(req.file.filename)
            return user.save()
        })
        .then((user) => res.status(200).json(user))
        .catch(err => res.status(500).json(err))
}