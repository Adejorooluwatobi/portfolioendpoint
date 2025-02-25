const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authur: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
