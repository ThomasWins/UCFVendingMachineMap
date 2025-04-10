// backend/controllers/userController.js
const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  try {
    const { login, password, userId, firstName, lastName, admin, favorites } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user without hashing the password
    const newUser = new User({
      login,
      password,  // Store password as plain text for now
      userId,
      firstName,
      lastName,
      admin,
      favorites,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Find the user by login
    const user = await User.findOne({ login });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check if password matches (simple comparison since passwords aren't hashed)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Return user data on successful login
    res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        admin: user.admin,
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
