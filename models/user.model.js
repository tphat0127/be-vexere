const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    fullName: {type: String},
    userType: {type: String, required: true, default: "Member"},
    avatarUrl: {type: String, default: "avatars/default.png"}
})
//Design pattern Observer => pbublisher + subcriber
//=>              ^^ Life cycle hook
//+ Create [Before Create, Affter Create]
//source design pattern: Head first, moshs
UserSchema.pre('save', function(next){
    const user = this  
    if(!user.isModified("password")) return next()

    bcrypt.genSalt(10)
        .then(salt => {
            return bcrypt.hash(user.password, salt)
        })
        .then(hash => {
            user.password = hash
            next()
        })
})

const User = mongoose.model('User', UserSchema, 'User')

module.exports = {
    UserSchema,
    User
}

