const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema({
    name: String,
    thumbnail: {type: String, required: true, default: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"},
    price: {type: Number, default: 24},
});

const Coach = mongoose.model('Coach', CoachSchema, 'Coach');

module.exports = {CoachSchema, Coach};