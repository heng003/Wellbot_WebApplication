require('dotenv').config(); 
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI); 

const express = require("express");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const authRouter = require('./routes/authRoute');
const fitbitRouter = require('./routes/fitbitRoute');

const app = express();

// 1. MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. ROUTE
app.use('/api/auth',authRouter);
app.use('/api/fitbit',fitbitRouter);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 3. MONGO DB CONNECTION
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas:", err));

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    next(err);
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('This is a test change to check Nodemon restart');
