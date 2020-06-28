const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  user_demande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  user_accepte: {
    email: {
      type: String,
      required: true,
    },
  },
  start_location: {
    type: String,
    required: true,
    unique: true,
  },
  end_location: {
    type: String,
    required: true,
    unique: true,
  },
  voiture: {
    type: String,
  },
  succes: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('trajet', trajetSchema);
