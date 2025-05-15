const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  requestType: String,
  message: String,
  controlNumber: String,
  status: String,
});

module.exports = mongoose.model("Request", requestSchema);
