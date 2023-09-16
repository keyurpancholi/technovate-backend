const mongoose = require('mongoose')
const Schema = mongoose.Schema

const organdonationschema = new Schema({
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Donor'
    },
    organQueue: [{type: Schema.Types.ObjectId, ref: 'Recipient'}],
    organ: String
})

const OrganDonation = mongoose.model('OrganDonation', organdonationschema)
module.exports = OrganDonation