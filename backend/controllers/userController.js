// backend/controllers/userController.js
const User = require('../models/userModel');
const Vending = require('../models/vendingModel');
const VendingRequest = require('../models/vendingRequestModel');
const upload = require('../middleware/uploads');
const { exec } = require('child_process'); // For executing automated scripts to upload images to server
// User Registration
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

    // Create a new user
    const newUser = new User({
      login,
      password,
      userId: nextUserId,
      firstName,
      lastName,
      admin,
      favorites,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: nextUserId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Find the user by login
    const user = await User.findOne({ login });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    // Create a session for the user
    req.session.user = {
      userId: user.userId || user.UserId,
      login: user.login || user.Login || user.username || user.userName || user.Username || user.UserName,
      firstName: user.firstName || user.FirstName || user.firstname || user.first_name || user.first,
      lastName: user.lastName || user.LastName || user.lastname || user.last_name || user.last,
      admin: user.admin || user.Admin || user.isAdmin || false,
      favorites: user.favorites || user.Favorites || []
    };

    console.log("Mapped userData:", req.session.user); // Log the mapped data before sending

    // Set the session cookie
    res.cookie('session_id', req.sessionID, {
      httpOnly: true,
      secure: false
    });

    // Return user data on successful login
    res.status(200).json({
      success: true,
      user: req.session.user
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }

};

// User Logout
exports.logoutUser = (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }

    // Clear the session cookie
    res.clearCookie('session_id');

    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// Retrieve User's Profile
exports.getUserProfile = async (req, res) => {
  try {
    // Obtain the userId as a parameter
    const userId = req.params.userId;
    const parsedUserId = parseInt(userId);
    
    console.log(`Looking up profile for userId: ${parsedUserId}`);

    // Find the user
    const user = await User.findOne({ userId: parsedUserId }).select('login firstName lastName favorites');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve favorite vending machines
    const favoriteVendingMachines = await Vending.find({ id: { $in: user.favorites } })
      .select('id name building type -_id');
    
    // Direct check for comments/ratings to verify data exists
    const checkVending = await Vending.findOne({
      $or: [
        { 'comments.userId': parsedUserId },
        { 'ratings.userId': parsedUserId }
      ]
    });
    
    console.log(`Direct DB check: User has comments/ratings: ${checkVending ? 'YES' : 'NO'}`);
    
    // Try simpler approach instead of aggregation
    const allVendings = await Vending.find({
      $or: [
        { 'comments.userId': parsedUserId },
        { 'ratings.userId': parsedUserId }
      ]
    }).select('id name building comments ratings');
    
    console.log(`Found ${allVendings.length} vending machines with user interactions`);

    const comments = [];
    const ratings = [];

    // Process each vending machine
    allVendings.forEach(vending => {
      // Extract matching comments
      if (vending.comments && Array.isArray(vending.comments)) {
        const userComments = vending.comments.filter(c => c.userId === parsedUserId);
        userComments.forEach(comment => {
          comments.push({
            vendingId: vending.id,
            vendingName: vending.name,
            building: vending.building,
            rating: comment.rating,
            text: comment.comment
          });
        });
      }
      
      // Extract matching ratings
      if (vending.ratings && Array.isArray(vending.ratings)) {
        const userRatings = vending.ratings.filter(r => r.userId === parsedUserId);
        userRatings.forEach(rating => {
          ratings.push({
            vendingId: vending.id,
            vendingName: vending.name,
            building: vending.building,
            rating: rating.rating
          });
        });
      }
    });
    
    console.log(`Extracted ${comments.length} comments and ${ratings.length} ratings`);

    // Return the user's profile with comments and ratings included
    res.status(200).json({
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      favorites: favoriteVendingMachines,
      comments: comments,
      ratings: ratings
    });

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: error.message });
  }
};

// Retrieve User's info
exports.getUserInfo = async (req, res) => {

  try {
    // Obtain the userId as a parameter
    const userId = req.params.userId;

    // Find the user
    const user = await User.findOne({ userId: parseInt(userId) }).select('login firstName lastName favorites userId admin');

    // Throw an error if the user is not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's profile
    res.status(200).json({
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      favorites: user.favorites,
      userId: user.userId,
      admin: user.admin,
    });

    // Catch any other errors
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// User can add favorite vending machines
exports.addFavorite = async (req, res) => {
  try {
    const { userId, vendingId } = req.body;

    // First let's check if the vendingId exists in our collection
    const vendingMachine = await Vending.findOne({ id: parseInt(vendingId) });
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

// User can remove favorite vending machines
exports.removeFavorite = async (req, res) => {
  try {
    const { userId, vendingId } = req.params;

    // Find the user by their userId.
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the vending machine is in their favorites.
    if (!user.favorites.includes(parseInt(vendingId))) {
      return res.status(400).json({ error: 'Favorite does not exist' });
    }

    // Remove the vending machine from their favorites.
    user.favorites = user.favorites.filter(id => id !== parseInt(vendingId));
    await user.save();
    return res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User can retrieve favorite vending machines
exports.retrieveFavorites = async (req, res) => {
  try {
    // Obtain the userId as a parameter
    const userId = req.params.userId;

    // Find the user
    const user = await User.findOne({ userId: parseInt(userId) });

    // Throw an error if the user is not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve favorite vending machines
    const favoriteVendingMachines = await Vending.find({ id: { $in: user.favorites } })
      .select('id name building type -_id');

    // Return favorite vending machines
    res.status(200).json(favoriteVendingMachines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User can submit a vending machine to be added to the map
exports.submitVendingRequest = [
  upload.single('image'), // Middleware to handle the image upload
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { latitude, longitude, description, building, type } = req.body;
      const imagePath = req.file ? req.file.path : null;

      // Validate input
      if (!latitude || !longitude || !description || !building || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
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
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        description,
        imagePath,
        building,
        type,
        status: 'pending',
        submittedAt: new Date()
      });

      await request.save();
      
      // Trigger the auto-commit script if an image was uploaded
      if (imagePath) {
        exec('bash /opt/bitnami/projects/cards/auto-commit-uploads.sh', (err, stdout, stderr) => {
          if (err) {
            console.error('Auto commit failed:', err);
            // Don't return here - we still want to send the response
          } else {
            console.log('Auto commit successful:', stdout);
          }
        });
      }
      
      return res.status(201).json({
        message: 'Vending machine request submitted successfully',
        requestId: request._id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
];

// Admin can view active vending machine requests
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

// Admin can update the status of the vending machine requests
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

// User can view their contributions to the map
exports.getUserContributions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query; // Optional filter for approved/pending/rejected

    // Validate user exists
    const user = await User.findOne({ userId: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build query to find user's contributions
    const query = { userId: parseInt(userId) };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Retrieve the user's contributions
    const contributions = await VendingRequest.find(query)
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      contributions,
      counts: {
        total: contributions.length,
        approved: contributions.filter(c => c.status === 'approved').length,
        pending: contributions.filter(c => c.status === 'pending').length,
        rejected: contributions.filter(c => c.status === 'rejected').length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
