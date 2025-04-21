const express = require('express');
const router = express.Router();
const Vending = require('../models/vendingModel');
const multer = require('multer');
const path = require('path');
const User = require('../models/userModel');


// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images go
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // filename with timestamp
  }
});
const upload = multer({ storage });

// POST /api/vending/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    
    const { building, description, type, lat, lng } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newVending = new Vending({
      building,
      description,
      type,
      coordinates: [parseFloat(lng), parseFloat(lat)],
      imageUrl,
      userId: req.session.user.userId,
      userLogin: req.session.user.login,
      ratings: [],
      comments: []
    });

    await newVending.save();
    res.status(201).json({
      success: true,
      vending: newVending
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
  let { userId, userName, rating, comment } = req.body;
  userId = parseInt(userId); 
  const vendingId = req.params.id;

  try {
    const vending = await Vending.findById(vendingId);
    if (!vending) return res.status(404).json({ error: 'Vending machine not found' });

    // logic for updating/adding ratings
    const existingRatingIndex = vending.ratings.findIndex(r => r.userId === userId);
    if (existingRatingIndex !== -1) {
      vending.ratings[existingRatingIndex].rating = rating;
    } else {
      vending.ratings.push({ userId, rating });
    }

    // logic for updating/adding comments
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
  let { userId, rating } = req.body;
  userId = parseInt(userId); 
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
    res.status(200).json({ success: true, message: 'Rating updated', vending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id/comment/:commentId', async (req, res) => {
  const vendingId = req.params.id;
  const commentId = req.params.commentId;

  try {
    // First, find the vencing machine by its ID
    const vending = await Vending.findById(vendingId);
    if (!vending) return res.status(404).json({ error: 'Vending machine not found' });

    // Find the index of the comment by its ObjectId
    const commentIndex = vending.comments.findIndex(
      c => c._id.toString() === commentId
    );

    // If the comment is not found, return an error
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Remove the comment from the array
    vending.comments.splice(commentIndex, 1);

    // Optionally, remove the rating associated with the comment if it exists
    const ratingIndex = vending.ratings.findIndex(
      r => r._id.toString() === commentId
    );
    // If the rating is found, remove it
    if (ratingIndex !== -1) {
      vending.ratings.splice(ratingIndex, 1);
    }

    // Save the updated vending machine information
    await vending.save();
    res.status(200).json({ message: 'Comment deleted successfully', vending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

