// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/favorites/add', userController.addFavorite);
router.post('/favorites/remove', userController.removeFavorite);


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); // or whatever cookie you use
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


// Submit a new vending machine request
router.post('/:userId/vending-requests', userController.submitVendingRequest);

// Get all vending machine requests (admin only)
router.get('/:userId/vending-requests', userController.getVendingRequests);

// Update a vending request status (admin only)
router.patch('/:userId/vending-requests/:requestId', userController.updateVendingRequest);

module.exports = router;
