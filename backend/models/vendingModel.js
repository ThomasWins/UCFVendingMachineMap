const mongoose = require('mongoose');

const vendingSchema = new mongoose.Schema({
  building: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  userId: {
    type: Number, // Store the userId who submitted the vending
    required: true
  },
  userLogin: {
    type: String, // Store user's login info for reference
    required: true
  },
  ratings: {
    type: [Number],
    default: []
  },
  comments: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Vending', vendingSchema);

