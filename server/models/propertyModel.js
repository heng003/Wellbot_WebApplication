const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    landlordId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    postcode: { type: String, required: true },
    bedroom: { type: String, required: true },
    bathroom: { type: String, required: true },
    furnishing: { type: String, required: true },
    parking: { type: String, required: true },
    floorLevel: { type: String, required: true },
    buildUpSize: { type: Number, required: true },
    facilities: { type: String, required: true },
    accessibility: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    coverPhoto: { type: String },
    photos: { type: [String] }
});

const Property = mongoose.model('properties', propertySchema);
module.exports = Property;
