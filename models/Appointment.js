const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentschema = new Schema({
  donorId: {
    type: Schema.Types.ObjectId,
    ref: 'Donor',
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipient',
  },
  organ: String,
  date: Date,
  doctors: {
    type: Array,
    default: [],
  },
  hospital_id: Number,
  hospital_name: String,
  hospital_location: String,
  reason: String,
});

const Appointment = mongoose.model('Appointment', appointmentschema);
module.exports = Appointment;
