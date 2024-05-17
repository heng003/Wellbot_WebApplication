// models/property.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    landlordId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    postcode: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    furnishing: { type: String, required: true },
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

const Property = mongoose.model('properties', propertySchema);
module.exports = Property;
