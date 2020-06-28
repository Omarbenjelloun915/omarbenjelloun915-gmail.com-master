const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  location_exacte: {
    type: String,
  },
  numberPhone: {
    type: String,
    required: true,
  },
  isPassenger: {
    type: Boolean,
    required: true,
  },
  connected: {
    type: Boolean,
    required: true,
  },
  bio: {
    type: String,
  },
  car: {
    type: String,
  },
  facebook: {
    type: String,
  },
  permis: {
    type: int,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profile', profileSchema);
