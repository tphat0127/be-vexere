const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    name: String,
    seats: {type: Number, default: 24}, 
    thumbnail: {type: String, default: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"},
});

const Coach = mongoose.model('Coach', CoachSchema, 'Coach');

module.exports = {CoachSchema, Coach};
