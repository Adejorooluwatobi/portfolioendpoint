const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    yearsOfExpert: {
        type: String,
        required: true,
    },
    projectCompleted: {
        type: String,
        required: true,
    },
    HappyClients: {
        type: String,
        required: true,
    },
});

const About = mongoose.model('About', AboutSchema);
module.exports = About;