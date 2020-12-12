const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    province: {type: String, required: true},
    thumbnail: {type: String, required: true, default: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"},
})

const Station = mongoose.model('Station', StationSchema, 'Station')

module.exports = {
    StationSchema,
    Station
}
