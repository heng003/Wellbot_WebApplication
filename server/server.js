require('dotenv').config(); 
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
const cors = require("cors");
const path = require('path');
const authRouter = require('./routes/authRoute');

const app = express();

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 2. ROUTE
app.use('/api/auth',authRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/public')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  });
  
// 3. MONGO DB CONNECTION
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        next(err);
    }
});

// Server listen
const PORT = process.env.PORT || 5000; // Use the PORT environment variable, default to 5000 if not set
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


