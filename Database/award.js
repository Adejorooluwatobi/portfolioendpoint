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
  position: {
    type: String,
    required: true
  },
  ViewProject: {
    type: String,
    required: true
  },
  LastUpdatedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Award', awardSchema);