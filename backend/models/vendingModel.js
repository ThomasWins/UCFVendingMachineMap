// models/vendingModel.js
const mongoose = require('mongoose');

const vendingSchema = new mongoose.Schema({
    vendingId: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    coordinates: { type: [Number], required: true },
    building: { type: String, required: true },
    image: { type: String, required: true }
  }, { collection: 'Vending' });
  
  module.exports = mongoose.model('Vending', vendingSchema);