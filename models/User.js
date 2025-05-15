const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  institutionalEmail: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
