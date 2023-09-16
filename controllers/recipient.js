const Recipient = require("../models/Recipient");
const OrganDonation = require("../models/OrganDonation");
const Match = require("../models/Match");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.login = async (req, res, next) => {
  let loadedUser;

  const { email, password } = req.body;

  try {
    const user = await Recipient.findOne({ email: email });
    if (!user) {
      const error = new Error("No recipient found. Invalid credentials");
      error.statusCode = 404;
      throw error;
    }
    loadedUser = user;
    const bool = await bcrypt.compare(password, user.password);
    if (!bool) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.email, donorId: loadedUser._id },
      "technovate",
      { expiresIn: "2h" }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.data = errors.array();
    error.statusCode = 422;
    throw error;
  }

  const { email, password } = req.body;

  try {
    const hashedpw = await bcrypt.hash(password, 12);
    const recipient = new Recipient({ email: email, password: hashedpw });
    const resp = await recipient.save();
    if (!resp) {
      const error = new Error("Failed to create a new account");
      error.statusCode = 400;
      throw err;
    }
    return res
      .status(201)
      .json({ message: "User registered successfully", data: resp });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.onboarding = async (req, res, next) => {
  const id = req.body._id;
  try {
    const data = await Recipient.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          fullname: req.body.fullname,
          age: req.body.age,
          gender: req.body.gender,
          blood_group: req.body.blood_group,
          blood_report: req.body.blood_report,
          medical_history: req.body.medical_history,
          aadhar_url: req.body.aadhar_url,
        },
      }
    );

    if (!data) {
      const error = new Error("Failed to create a new account");
      error.statusCode = 400;
      throw error;
    }

    return res
      .status(201)
      .json({ message: "Onboarding successful", data: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.request = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.body.donor_id);
  const recipient_id = new mongoose.Types.ObjectId(req.body.recipient_id);

  try {
    const resp = await OrganDonation.findById({ _id: id });
    if (!resp) {
      const error = new Error("No user found");
      error.statusCode = 404;
      throw error;
    }
    resp.organQueue.push(recipient_id);

    const data = await resp.save();
    if (!data) {
      const error = new Error("Couldnt add recipient to list");
      error.statusCode = 400;
      throw error;
    }

    res.json(201).json({ data: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
