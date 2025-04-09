const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 5000;

// MongoDB connection
const url = "mongodb+srv://santycastro2004:jQvXXiFa1oUpqFJF@cluster0.iggc36l.mongodb.net/BigProject?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url, { serverApi: ServerApiVersion.v1 });

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    app.locals.db = client.db('BigProject');
  } catch (err) {
    console.error("Connection Error:", err);
  }
}
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
