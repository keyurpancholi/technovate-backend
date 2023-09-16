const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorschema = new Schema({
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
  aadhar_url: {
    type: String,
  },
  medical_history: String,
  organ: {
    type: String,
  },
});

const Donor = mongoose.model('Donor', donorschema)
module.exports = Donor
