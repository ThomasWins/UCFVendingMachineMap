// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User's Register/Login/Logout
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// User's favorites
router.post('/favorites/add', userController.addFavorite);
router.get('/:userId/favorites', userController.retrieveFavorites);
router.delete('/:userId/favorites/:vendingId', userController.removeFavorite);

// User's profile
router.get('/profile/:userId', userController.getUserProfile);

// User's info
router.get('/info/:userId', userController.getUserInfo);

// User's vending machine request submission
router.post('/:userId/vending-requests', userController.submitVendingRequest);

// User's contributions
router.get('/:userId/contributions', userController.getUserContributions);

// Get all vending machine requests (admin only)
router.get('/:userId/vending-requests', userController.getVendingRequests);

// Update a vending machine's request status (admin only)
router.patch('/:userId/vending-requests/:requestId', userController.updateVendingRequest);

module.exports = router;
