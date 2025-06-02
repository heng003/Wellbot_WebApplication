const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, },
    email: { type: String, unique: true, required: true, },
    phonenumber: { type: String, required: true },
    fullname: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    tokenExpires: { type: Date, required: false },
    tokenEmail: { type: String },
    fitbitAccessToken: { type: String, required: true },
    fitbitRefreshToken: { type: String, required: true },
    fitbitExpiresAt: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
