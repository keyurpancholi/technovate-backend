const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipientSchema = new Schema({
  email: String,
  password: String,
  fullname: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  blood_group: {
    type: String,
  },
  blood_report: {
    type: String,
  },

  medical_history: String,
  aadhar_url: {
    type: String,
  },
});

const Recipient = mongoose.model("Recipient", recipientSchema);
module.exports = Recipient;
