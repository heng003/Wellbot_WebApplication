const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const authRouter = require('./routes/authRoute');

const app = express();

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// 2. ROUTE
app.use('/api/auth',authRouter);

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
  
// 3. MONGO DB CONNECTION
mongoose
.connect('mongodb://localhost:27017/RentSpotter')
.then(()=> console.log('Connected to MongoDB!'))
.catch((error)=>console.error('Failed to connect to MongoDB: ',error));

// 4. GLOBAL ERROR HANDLER
app.use((err,req,res ,next)=>{
    err.statuCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statuCode).json({
        status: err.status,
        message:err.message,
    });
});

// 5. SERVER
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("App running on " , PORT);
});