const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile:   { type: String, required: true },
  address:  { type: String, required: true },
  pincode:  { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
