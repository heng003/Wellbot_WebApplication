const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, unique: true, required: true, },
    password: { type: String, required: true },
    fullname: { type: String },
    username: { type: String, required: true, },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    age: { type: Number, min: 0, required: true },
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device' },
    allowGuardian: { type: Boolean, default: false }, 
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    tokenExpires: { type: Date, required: false },
    tokenEmail: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
