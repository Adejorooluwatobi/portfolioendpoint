const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    Image: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Link:[
        {
            image: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;