const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;