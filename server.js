const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

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

app.use(cors());
app.use(bodyParser.json());

// Session Configuration
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// cors header setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Import routes
const userRoutes = require('./backend/routes/userRoutes');
const vendingRoutes = require('./backend/routes/vendingRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/vending', vendingRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
