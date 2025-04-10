const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Import routes
const userRoutes = require('./backend/routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);

app.post('/api/login', async (req, res, next) => {
    const { login, password } = req.body;
    var error = '';

    const db = mongoose.connection.db;
    const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }

    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
