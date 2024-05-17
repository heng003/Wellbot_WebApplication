const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    applicationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', required: true }
});

module.exports = mongoose.model('application', applicationSchema);