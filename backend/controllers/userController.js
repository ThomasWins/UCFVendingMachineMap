// backend/controllers/userController.js
const User = require('../models/userModel');
const Vending = require('../models/vendingModel');
const VendingRequest = require('../models/vendingRequestModel');

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

//
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: 'Logged out successfully' });
  });
};
//

exports.addFavorite = async (req, res) => {
  try {
    const { userId, vendingId } = req.body;

    // First let's check if the vendingId exists in our collection
    const vendingMachine = await Vending.findOne({ vendingId: parseInt(vendingId) });
    if (!vendingMachine) {
      return res.status(404).json({ error: 'Vending machine does not exist.' });
    }

    // Find the user by their userId.
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the vending machine if it's not already a favorite.
    if (!user.favorites.includes(vendingId)) {
      user.favorites.push(vendingId);
      await user.save();
      return res.status(200).json({ message: 'Favorite added successfully' });
    } else {
      return res.status(400).json({ error: 'Favorite already exists' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, vendingId } = req.body;

    // Find the user by their userId.
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the vending machine is in their favorites.
    if (!user.favorites.includes(vendingId)) {
      return res.status(400).json({ error: 'Favorite does not exist' });
    }

    // Remove the vending machine from their favorites.
    user.favorites = user.favorites.filter(id => id !== vendingId);
    await user.save();
    return res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitVendingRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { coordinates, description } = req.body;
    
    // Validate input
    if (!coordinates || !description) {
      return res.status(400).json({ error: 'Coordinates and description are required' });
    }
    
    // Find the user by userId
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create a new vending machine request
    const request = new VendingRequest({
      userId: user.userId,
      userLogin: user.login,
      coordinates,
      description,
      status: 'pending',
      submittedAt: new Date()
    });
    
    await request.save();
    return res.status(201).json({ 
      message: 'Vending machine request submitted successfully',
      requestId: request._id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the user and check if they're an admin
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.admin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get all pending requests
    const requests = await VendingRequest.find().sort({ submittedAt: -1 });
    return res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVendingRequest = async (req, res) => {
  try {
    const { userId, requestId } = req.params;
    const { status, adminComment } = req.body;
    
    // Validate admin status
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user || !user.admin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update request status
    const request = await VendingRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    request.status = status;
    request.adminComment = adminComment;
    request.processedAt = new Date();
    request.processedBy = user.userId;
    
    await request.save();
    return res.status(200).json({ 
      message: 'Vending request updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
