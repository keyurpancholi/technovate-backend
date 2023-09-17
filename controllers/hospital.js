const Hospital = require('../models/Hospital');
const Match = require('../models/Match');
const OrganDonation = require('../models/OrganDonation');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');

exports.organMatchInitialize = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.body.donor_id);

  const organ = new OrganDonation({ donorId: id, organQueue: [] });
  try {
    const data = await organ.save();
    if (!data) {
      const error = new Error("Couldn't initialize organ donation queue");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json({ data: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createMatch = async (req, res, next) => {
  const recipient_id = new mongoose.Types.ObjectId(req.body.recipient_id);
  const donor_id = new mongoose.Types.ObjectId(req.body.donor_id);
  const organ = req.body.organ;
  const status = req.body.status;
  const decline_message = req.body.decline_message || '';

  const match = new Match({
    donorId: donor_id,
    recipientId: recipient_id,
    organ: organ,
    status: status,
    decline_message: decline_message,
  });
  try {
    const data = await match.save();
    if (!data) {
      const error = new Error('Cant create a match');
      error.statusCode = 400;
      throw error;
    }

    const resp = await OrganDonation.findOne({ donorId: donor_id });
    if (!resp) {
      const error = new Error("Can't find a organ");
      error.statusCode = 400;
      throw error;
    }
    const idx = resp.organQueue.findIndex((recpId) => {
      recpId == recipient_id;
    });
    resp.organQueue.splice(idx, 1);
    const result = await resp.save();
    if (!result) {
      const error = new Error('Cant delete a match');
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// exports.updateMatchById = async (req, res, next) => {
//   const { status } = req.body;
//   const update = await Match.updateOneById();
// };
// exports.getAllMatch = async (req, res, next) => {
//   const matches = await Match.find();
//   const data = await matches.json();

//   return res.status(200).json({ data: data });
// };

exports.getAllOrgans = async (req, res, next) => {
  try {
    const list = await OrganDonation.find().populate(['organQueue', 'donorId']);
    return res.status(200).json({ data: list });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  const status = req.body.status;
  const id = req.body.id;

  try {
    if (status === 'Approved') {
      const resp = await Match.findByIdAndUpdate(
        { id: id },
        { $set: { status: status } }
      );
      if (!resp) {
        const error = new Error('Couldnt find a recipient');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ data: resp });
    } else {
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.rejectStatus = async (req, res, next) => {
  const status = req.body.status;
  const id = req.body.id;

  try {
    const resp = await Match.findByIdAndUpdate(
      { _id: id },
      { $set: { status: status } }
    );
    if (!resp) {
      const error = new Error('Couldnt find a recipient');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ data: resp });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSingleMatch = async (req, res, next) => {};

exports.login = async (req, res, next) => {
  let loadedUser;

  const { email, password } = req.body;

  try {
    const user = await Hospital.findOne({ email: email });
    if (!user) {
      const error = new Error('No recipient found. Invalid credentials');
      error.statusCode = 404;
      throw error;
    }
    loadedUser = user;
    const bool = await bcrypt.compare(password, user.password);
    if (!bool) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.email, donorId: loadedUser._id },
      'technovate',
      { expiresIn: '2h' }
    );
    return res.status(200).json({ token: token, user: loadedUser });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const hashedpw = await bcrypt.hash(password, 12);
    const hospital = new Hospital({ email: email, password: hashedpw });
    const resp = await hospital.save();
    if (!resp) {
      const error = new Error('Failed to create a new account');
      error.statusCode = 400;
      throw err;
    }
    return res
      .status(201)
      .json({ message: 'User registered successfully', data: resp });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.makeAppointment = async (req, res, next) => {
  const { recipient_id, donor_id, date, organ, doctors, hospital_id } =
    req.body;
  const appointment = new Appointment({
    recipientId: new mongoose.Types.ObjectId(recipient_id),
    donorId: new mongoose.Types.ObjectId(donor_id),
    date,
    doctors,
    organ,
    hospital: new mongoose.Types.ObjectId(hospital_id),
  });
  try {
    const data = await appointment.save();
    res.json({ data: data });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAppointmentsByHospital = async (req, res) => {
  const { hospital_id } = req.params.id;
  try {
    const resp = await Appointment.findOne({
      hospitalId: new mongoose.Types.ObjectId(hospital_id),
    });

    res.json({ data: resp });
  } catch (err) {
    return res.status(500).json(err);
  }
};
