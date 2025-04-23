const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// MongoDB connection
const url = "mongodb+srv://santycastro2004:jQvXXiFa1oUpqFJF@cluster0.iggc36l.mongodb.net/BigProject?retryWrites=true&w=majority";
async function connectDB() {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Connection Error:", err);
    }
}

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: 'https://gerberthegoat.com',
    credentials: true,
};

app.use(cors(corsOptions));

// Session Configuration
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000
    }
}));

// DIRECT IMAGE HANDLER - emergency fix for image loading issues
app.get('*/uploads/*.(jpg|jpeg|png)', (req, res) => {
  try {
    // Extract the image path from the request
    let imagePath = req.path;
    if (imagePath.includes('/uploads/')) {
      imagePath = imagePath.substring(imagePath.indexOf('/uploads/') + 9);
    }
    
    // Full path to the image file
    const fullPath = path.join(__dirname, 'uploads', imagePath);
    console.log('Attempting to serve image at:', fullPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error('Image file not found:', fullPath);
      return res.status(404).send('Image not found');
    }
    
    // Set the appropriate content type based on file extension
    if (fullPath.endsWith('.jpg') || fullPath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (fullPath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
    
    // Stream the file directly
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).send('Error serving image');
  }
});

// IMPORTANT: Image handling middleware must come BEFORE route handlers
// Serve files from uploads directory with proper MIME types
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    console.log(`Serving file: ${filePath} with Content-Type: ${res.get('Content-Type')}`);
  }
}));

// Serve uploads at root path for backward compatibility
app.use('/', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
  }
}));

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const vendingRoutes = require('./backend/routes/vendingRoutes');

// User and Vending Routes
app.use('/api/users', userRoutes);
app.use('/api/vending', vendingRoutes);

// Add this debugging middleware at the end to catch any missed image requests
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads/') || req.path.match(/\.(jpg|jpeg|png)$/i)) {
    console.log(`Image request missed by static middleware: ${req.path}`);
  }
  next();
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
