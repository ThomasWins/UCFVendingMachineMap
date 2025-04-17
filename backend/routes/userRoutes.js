// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/favorites/add', userController.addFavorite);
router.delete('/:userId/favorites/:vendingId', userController.removeFavorite);


// Submit a new vending machine request
router.post('/:userId/vending-requests', userController.submitVendingRequest);

// Get all vending machine requests (admin only)
router.get('/:userId/vending-requests', userController.getVendingRequests);

// Update a vending request status (admin only)
router.patch('/:userId/vending-requests/:requestId', userController.updateVendingRequest);

module.exports = router;
