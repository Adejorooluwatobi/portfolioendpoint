const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

const Expert = mongoose.model('Expert', expertSchema);

module.exports = Expert;