const mongoose = require('mongoose');
const { Schema } = mongoose;

const guardianSchema = new Schema({
    email: { type: String, unique: true, required: true, },
    password: { type: String, required: true },
    fullname: { type: String },
    username: { type: String, required: true, },
    monitoredDevices: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    tokenExpires: { type: Date, required: false },
    tokenEmail: { type: String },
});

const Guardian = mongoose.model("Guardian", guardianSchema);

module.exports = Guardian;