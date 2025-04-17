const express = require('express');
const router = express.Router();
const Vending = require('../models/vendingModel');

// get all of the vending machines from the database
router.get('/', async (req, res) => {
  try {
    const vendingMachines = await Vending.find();
    console.log('Vending machines retrieved:', vendingMachines);
    res.json(vendingMachines);
  } catch (err) {
    console.error('Error fetching vending machines:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comment', async (req, res) => {
  const { userId, userName, rating, comment } = req.body;
  const vendingId = req.params.id;

  try {
    const vending = await Vending.findById(vendingId);
    if (!vending) return res.status(404).json({ error: 'Vending machine not found' });

    // logic for updating/ adding ratings
    const existingRatingIndex = vending.ratings.findIndex(r => r.userId === userId);
    if (existingRatingIndex !== -1) {
      vending.ratings[existingRatingIndex].rating = rating;
    } else {
      vending.ratings.push({ userId, rating });
    }

    // logic for updating/ adding comments
    const existingCommentIndex = vending.comments.findIndex(c => c.userId === userId);
    if (existingCommentIndex !== -1) {
      vending.comments[existingCommentIndex] = { userId, userName, rating, comment };
    } else {
      vending.comments.push({ userId, userName, rating, comment });
    }

    await vending.save();
    res.status(200).json({ message: 'Review submitted', vending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/updateRating', async (req, res) => {
  const { userId, rating } = req.body;
  const vendingId = req.params.id;

  try {
    const vending = await Vending.findById(vendingId);
    if (!vending) return res.status(404).json({ error: 'Vending machine not found' });

    const existingRatingIndex = vending.ratings.findIndex(r => r.userId === userId);
    if (existingRatingIndex !== -1) {
      vending.ratings[existingRatingIndex].rating = rating;
    } else {
      vending.ratings.push({ userId, rating });
    }

    await vending.save();
    res.status(200).json({ success: true, message: 'rating updated ', vending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

