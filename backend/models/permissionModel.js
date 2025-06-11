const mongoose = require('mongoose');
const { Schema } = mongoose;

const guardianSchema = new Schema({
    guardianId: { type: Schema.Types.ObjectId, ref: 'Guardian' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'pending', 'reject', 'revoked']},
    requestedAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
});

const Permission = mongoose.model("Permission", guardianSchema);

module.exports = Permission;