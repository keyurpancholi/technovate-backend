const Match = require("../models/Match");

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
    if(!error.statusCode){
        error.statusCode = 500
    }
    next(error)
  }
};

exports.getSingleMatch = async (req, res, next) => {
    
}