const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gymSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now()
    },
    latitude: {
        type: Number,
        required: true,
    },
      longitude: {
        type: Number,
        required: true,
    },
    
})

const gym = mongoose.model("gym", gymSchema)

module.exports = gym;
