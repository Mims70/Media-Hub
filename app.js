const dotenv = require("dotenv")
require("express-async-errors");
dotenv.config();

const express = require('express');
const cors = require("cors");
const connectDB = require('./server/config/db');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use("/api/v1", require("./routes/index.routes"));

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;