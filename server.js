const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const hospitalRoutes = require("./routes/hospital");
const donorRoutes = require("./routes/donor");
const recipientRoutes = require("./routes/recipient");
const app = express();

const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/hospital", hospitalRoutes);
app.use("/donor", donorRoutes);
app.use("/recipient", recipientRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message || "Error found";
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pahmv1w.mongodb.net/technovate?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log("App running succesfully on port " + port);
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
