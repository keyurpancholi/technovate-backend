const mongoose = require('mongoose')
const Schema = mongoose.Schema

const matchschema = new Schema({
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Donor'
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'Recipient'
    },
    organ: String,
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending'
    }
})

const Match = mongoose.model('Match', matchschema)
module.exports = Match