require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');

const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const permissionRouter = require('./routes/permissionRoute');
const fitbitRouter = require('./routes/fitbitRoute');
const emotionRouter = require('./routes/emotionRoute');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const anon = process.env.ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
try {
  console.log("ANON_KEY:", jwt.verify(anon, secret));
  console.log("SERVICE_ROLE_KEY:", jwt.verify(service, secret));
} catch (e) {
  console.error("❌ Invalid:", e.message);
}

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
app.use('/api/auth', authRouter);
// Protect all other API routes
app.use('/api', authMiddleware);
app.use('/api/profile', authMiddleware, profileRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/fitbit', fitbitRouter);
app.use('/api/emotion', emotionRouter);

// React frontend
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 3. GLOBAL ERROR HANDLER
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