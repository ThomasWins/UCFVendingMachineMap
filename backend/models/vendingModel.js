const mongoose = require('mongoose');

const vendingSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  coordinates: { type: [Number], required: true }, 
  building: { type: String, required: true },
  type: { type: String, required: true }, 
  imageUrl: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      rating: { type: Number, required: true },
    }
  ],
  comments: [
    {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    }
  ]
});

module.exports = mongoose.model('Vending', vendingSchema, 'vendingMachines');
