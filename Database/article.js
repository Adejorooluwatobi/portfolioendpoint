const mongoose = require("mongoose");
const { updateMany } = require("./about");

const articleSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' 
    },
    title: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;