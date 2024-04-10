const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  role: String,
  userRole: String,
  passwordChanged: { type: Boolean, default: false },
  projectAllocated: {type : Boolean , default: false} // New field for user schema
});

const User = mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
