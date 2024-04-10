const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  key: String,
  role: String,
  passwordChanged: { type: Boolean, default: false } // New field for admin schema
});

const Admin = mongoose.model('Admin', adminSchema);


module.exports = mongoose.model('Admin', adminSchema);
