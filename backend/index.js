require('dotenv').config();
const express = require("express");
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const permissionRouter = require('./routes/permissionRoute');
const fitbitRouter = require('./routes/fitbitRoute');
const emotionRouter = require('./routes/emotionRoute');
const journalRouter = require('./routes/journalRoute');
const gratitudeRouter = require('./routes/gratitudeRoute');
const interventionRouter = require('./routes/interventionRoute');
const embeddingRouter = require('./routes/embeddingRoute');
const authMiddleware = require('./middleware/authMiddleware');
const realtimeService = require('./services/realtimeService');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
	cors: {
		origin: process.env.REACT_APP_WELLBOT_FRONTEND_URL || 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	}
});

// Socket.io Middleware for Authentication
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) {
		return next(new Error("Authentication error: No token provided"));
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return next(new Error("Authentication error: Invalid token"));
		}
		socket.userId = decoded.userId;
		next();
	});
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
	console.log(`Socket connected: ${socket.id}, User: ${socket.userId}`);

	// Join user-specific room & Subscribe to Realtime
	if (socket.userId) {
		socket.join(`user_${socket.userId}`);
		realtimeService.subscribeUser(socket.userId, io);
		console.log(`User ${socket.userId} joined room user_${socket.userId}`);
	}

	socket.on('disconnect', () => {
		console.log('Socket disconnected:', socket.id);
		if (socket.userId) {
			realtimeService.unsubscribeUser(socket.userId);
		}
	});
});

// Remove global subscription call
// setupRealtimeSubscriptions(io);

// 1. MIDDLEWARES
// use this to deploy
app.use(cors({
	origin: process.env.REACT_APP_WELLBOT_FRONTEND_URL || 'http://localhost:3000',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
}));
// app.use(cors());
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
app.use('/api/journal', journalRouter);
app.use('/api/gratitude', gratitudeRouter);
app.use('/api/intervention', interventionRouter);
app.use('/api/embedding', embeddingRouter);

// React frontend
// app.get('*', function (req, res) {
// 	res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
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
// use this to deploy
server.listen(PORT, '0.0.0.0', () => {
	console.log(`Well-Bot is listening on port ${PORT}`);
});
// server.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });