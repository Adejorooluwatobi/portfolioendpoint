const mongoose = require('mongoose');

// Define a custom validation function for array length
function arrayLimit(val) {
    return val.length > 0;
}

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} must have at least one image']
    },
    isActive: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: String,
        default: 'Admin'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now // Ensure this is set by default
    }
});

BlogSchema.pre('save', function(next) {
    this.lastUpdatedDate = new Date(); // Update lastUpdatedDate before saving
    next();
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
