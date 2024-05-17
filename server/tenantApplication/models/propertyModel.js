const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
    landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['Landed', 'Condo', 'Commercial', 'Room'], required: true},
    address: { type: String, required: true },
    location: { type: String, required: true },
    postcode: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    furnishing: { type: String, enum: ['Fully-furnished', 'Partially-furnished', 'Unfurnished'], required: true},
    parking: { type: Number, required: true },
    floorLevel: { type: Number, required: true },
    buildUpSize: { type: Number, required: true },
    facilities: { type: String, required: true },
    accessibility: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    coverPhoto: { type: String, required: true },
    photos: { type: [String], required: true }
});

module.exports = mongoose.model('property', propertySchema);

