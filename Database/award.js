const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    postision: {
        type: String,
        required: true
    },
    ViewProject: {
        type: String,
        required: true
    },
});