// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User's Register/Login/Logout
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// User's Profile/Info
router.get('/profile/:userId', userController.getUserProfile);
router.get('/info/:userId', userController.getUserInfo);

// User's Add/Delete/Retrieve Favorites
router.post('/favorites/add', userController.addFavorite);
router.delete('/:userId/favorites/:vendingId', userController.removeFavorite);
router.get('/:userId/favorites', userController.retrieveFavorites);

// User's Requests/Contributions
router.post('/:userId/vending-requests', userController.submitVendingRequest);
router.get('/:userId/contributions', userController.getUserContributions);

// Admin Retrieve/Update Requests
router.get('/:userId/vending-requests', userController.getVendingRequests);
router.patch('/:userId/vending-requests/:requestId', userController.updateVendingRequest);

module.exports = router;
