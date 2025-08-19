const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  bio: { type: String, default: "" },
  photo: { type: String, default: "" } // Store image as base64 string or URL
});

module.exports = mongoose.model('Profile', ProfileSchema);