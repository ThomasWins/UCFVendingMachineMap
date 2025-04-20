const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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

// Import Routes
const userRoutes = require('./backend/routes/userRoutes');
const vendingRoutes = require('./backend/routes/vendingRoutes');

// User and Vending Routes
app.use('/api/users', userRoutes);
app.use('/api/vending', vendingRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
