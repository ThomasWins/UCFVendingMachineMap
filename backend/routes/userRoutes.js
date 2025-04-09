const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/login
router.post('/login', userController.loginUser);

module.exports = router;
