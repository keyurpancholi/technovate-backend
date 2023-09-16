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
  doctors: Array,
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
  },
});

const Appointment = mongoose.model('Appointment', appointmentschema);
module.exports = Appointment;
