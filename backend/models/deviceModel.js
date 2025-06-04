const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
    serialNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    fitbitAccessToken: { type: String, required: true },
    fitbitRefreshToken: { type: String, required: true },
    fitbitExpiresAt: { type: Date, required: true },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;