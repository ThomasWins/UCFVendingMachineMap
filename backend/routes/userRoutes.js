// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User's basic operations
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// User's favorites
router.post('/favorites/add', userController.addFavorite);
router.get('/:userId/favorites', userController.retrieveFavorites);
router.delete('/:userId/favorites/:vendingId', userController.removeFavorite);

// User's profile
router.get('/profile/:userId', userController.getUserProfile);

// Submit a new vending machine request
router.post('/:userId/vending-requests', userController.submitVendingRequest);

// Get all vending machine requests (admin only)
router.get('/:userId/vending-requests', userController.getVendingRequests);

// Update a vending request status (admin only)
router.patch('/:userId/vending-requests/:requestId', userController.updateVendingRequest);

// Get a user's contributions/submissions
router.get('/:userId/contributions', userController.getUserContributions);

module.exports = router;
