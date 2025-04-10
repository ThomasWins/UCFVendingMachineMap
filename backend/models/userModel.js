// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Store passwords as plain text for now
  userId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  admin: { type: Boolean, default: false },
  favorites: [{ type: Number }],
}, { collection: 'Users' });

// Add hashing here later

module.exports = mongoose.model('User', userSchema);
