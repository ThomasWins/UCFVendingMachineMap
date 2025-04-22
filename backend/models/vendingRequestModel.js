const mongoose = require('mongoose');

const vendingRequestSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  userLogin: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: Number
  },
  adminComment: {
    type: String
  }
});

module.exports = mongoose.model('VendingRequest', vendingRequestSchema);
