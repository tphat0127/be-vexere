const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    name: String,
    seats: {type: Number, default: 24}, 
    thumbnail: {type: String, default: "coachs/default.png"},
});

const Coach = mongoose.model('Coach', CoachSchema, 'Coach');

module.exports = {CoachSchema, Coach};
