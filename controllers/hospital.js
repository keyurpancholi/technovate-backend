const Match = require("../models/Match");
const OrganDonation = require("../models/OrganDonation");
const mongoose = require("mongoose");

exports.organMatchInitialize = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.body.donor_id);

  const organ = new OrganDonation({ donorId: id, organQueue: [] });
  try {
    const data = await organ.save();
    if(!data){
      const error = new Error("Couldn't initialize organ donation queue")
      error.statusCode = 400
      throw error
    }
    res.status(201).json({data: data})
  } catch (error) {
    if(!error.statusCode){
      error.statusCode = 500
    }
    next(error)
  }
};

exports.createMatch = async (req, res, next) => {
  const recipient_id = new mongoose.Types.ObjectId(req.body.recipient_id)
  const donor_id = new mongoose.Types.ObjectId(req.body.donor_id)
  const organ = req.body.organ

  const match = new Match({donorId: donor_id, recipientId: recipient_id, organ: organ})
  try {
    const data = await match.save()
    if(!data){
      const error = new Error("Cant create a match")
      error.statusCode = 400
      throw error
    }
    return res.status(200).json({data: data})
  } catch (error) {
    if(!error.statusCode){
      error.statusCode = 500
    }
    next(error)
  }
}

exports.getAllMatch = async (req, res, next) => {
  const matches = await Match.find();
  const data = await matches.json();

  return res.status(200).json({ data: data });
};

exports.updateStatus = async (req, res, next) => {
  const status = req.body.status;
  const id = req.body.id;

  try {
    const resp = await Match.findByIdAndUpdate(
      { id: id },
      { $set: { status: status } }
    );
    if (!resp) {
      const error = new Error("Couldnt find a recipient");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSingleMatch = async (req, res, next) => {};
