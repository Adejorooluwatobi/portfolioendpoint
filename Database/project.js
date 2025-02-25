const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;