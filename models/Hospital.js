const mongoose = require("mongoose")
const Schema = mongoose.Schema

const hospitalschema = new Schema({
    email: String,
    password: String
})

const Hospital = mongoose.model("Hospital", hospitalschema)
module.exports = Hospital