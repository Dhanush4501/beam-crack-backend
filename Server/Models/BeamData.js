const mongoose = require('mongoose');

const BeamDataSchema = new mongoose.Schema({
  date: String,
  time: String,
  channel: Number,
  millimeter: Number,
  frequency: Number,
  temperature: Number,
  // new fields to track ownership
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userEmail: { type: String, required: false, index: true }
}, { timestamps: true });

module.exports = mongoose.model('BeamData', BeamDataSchema);
