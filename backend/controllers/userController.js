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

    // Assign unique userId
    const assignId = await User.findOne().sort({ userId: -1 }).limit(1);
    const nextUserId = assignId ? assignId.userId + 1 : 1;

    // Create a new user without hashing the password
    const newUser = new User({
      login,
      password,  // Store password as plain text for now
      userId: nextUserId,
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
    console.log("User document keys:", Object.keys(user._doc)); // Log all available fields
    console.log("Complete user object:", JSON.stringify(user._doc, null, 2)); // Log the whole user document

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check if password matches (simple comparison since passwords aren't hashed)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // User data object with more variations and with the raw _doc object
    const userData = {
      userId: user._id || user.userId || user.UserId,
      login: user.login || user.Login || user.username || user.userName || user.Username || user.UserName,
      firstName: user.firstName || user.FirstName || user.firstname || user.first_name || user.first,
      lastName: user.lastName || user.LastName || user.lastname || user.last_name || user.last,
      admin: user.admin || user.Admin || user.isAdmin || false,
      favorites: user.favorites || user.Favorites || []
    };

    console.log("Mapped userData:", userData); // Log the mapped data before sending

    // Return user data on successful login
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { vendingId } = req.body;

    // Find the user by userId
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add vendingId to favorites if not already present
    if (!user.favorites.includes(vendingId)) {
      user.favorites.push(vendingId);
      await user.save();
      return res.status(200).json({ message: 'Favorite added successfully' });

      // Otherwise, inform that it's already a favorite
    } else {
      return res.status(400).json({ error: 'Favorite already exists' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, vendingId } = req.params;

    // Find the user by userId
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove vendingId from favorites
    user.favorites = user.favorites.filter(id => id !== parseInt(vendingId));
    await user.save();
    return res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};