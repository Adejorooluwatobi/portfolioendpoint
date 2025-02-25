const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    LastUpdatedDate: {
        type: Date,
        default: Date.now
    },
    IsActive: {
        type: Boolean,
        default: true
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
