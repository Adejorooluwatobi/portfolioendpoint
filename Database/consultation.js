const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  budget: {
    type: String,
    required: true,
  },
  email: { 
    type: String, 
    required: true 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createDate: { 
    type: Date, 
    default: Date.now 
  },
  closed: { 
    type: Boolean, 
    default: false 
  },
  modifiedDate: { 
    type: Date 
  },
});

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
