// routes/property.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Property = require('../models/property');
const LandlordAcc = require('../models/user'); // Assuming user.js is named 'user'

// Create a new property
router.post('/', asyncHandler(async (req, res) => {
    const { email, ...propertyData } = req.body;

    // Find the landlord by email
    const landlord = await LandlordAcc.findOne({ email, role: 'landlord' });
    if (!landlord) {
        return res.status(404).json({ error: 'Landlord not found' });
    }

    // Create new property
    const property = new Property({ ...propertyData, landlordId: landlord._id });
    await property.save();

    // Optionally add the property to the landlord's properties array
    landlord.properties.push(property._id);
    await landlord.save();

    res.status(201).json(property);
}));

module.exports = router;
