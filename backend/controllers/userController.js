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

    // Find the user by login - log what we find to debug
    const user = await User.findOne({ login });
    console.log("User found:", user); // Add this to see exact DB structure
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check if password matches (simple comparison since passwords aren't hashed)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Map fields correctly - check for both lowercase and uppercase first letter variants
    const userData = {
      userId: user.userId || user.UserId || user._id,
      login: user.login || user.Login,
      firstName: user.firstName || user.FirstName,
      lastName: user.lastName || user.LastName,
      admin: user.admin || user.Admin || false,
      favorites: user.favorites || user.Favorites || []
    };

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
