const Recipient = require("../models/Recipient");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
    next(err);
  }
};

exports.onboarding = async (req, res, next) => {
  const email = req.email;
  try {

    const data = await Recipient.update(
      { email: email },
      {
        $set: {
          fullname: req.fullname,
          age: req.age,
          gender: req.gender,
          blood_group: req.blood_group,
          aadhar_url: req.aadhar_url,
        },
      }
    );

    if (!data) {
      const error = new Error("Failed to create a new account");
      error.statusCode = 400;
      throw err;
    }

    return res
      .status(201)
      .json({ message: "Onboarding successful", data: data });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(err);
  }
};
