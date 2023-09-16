const mongoose = require("mongoose");
const Donor = require("../models/Donor");
const OrganDonation = require("../models/OrganDonation");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation failed");
  //   error.data = errors.array();
  //   error.statusCode = 422;
  //   throw error;
  // }

  const { email, password } = req.body;

  try {
    const hashedpw = await bcrypt.hash(password, 12);
    const donor = new Donor({ email: email, password: hashedpw });
    const resp = await donor.save();
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
  try {
    const id = new mongoose.Types.ObjectId(req.body._id);
    const data = await Donor.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          fullname: req.body.fullname,
          age: req.body.age,
          gender: req.body.gender,
          blood_group: req.body.bodyblood_group,
          blood_report: req.body.blood_report,
          aadhar_url: req.body.aadhar_url,
          organ: req.body.organ,
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

exports.getRecipientList = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.body.donor_id);

  try {
    const list = await OrganDonation.findOne({ donorId: id }).populate('organQueue');
    if (!list) {
      const error = new Error("No organ donor found");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({data: list})
  } catch (error) {
    if(!error.statusCode){
      error.statusCode = 500
    }
    next(error)
  }
};
