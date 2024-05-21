const Property = require('../models/propertyModel');

exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        console.error("Error fetching properties:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getPropertiesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const properties = await Property.find({ landlordId: userId });
        res.json(properties);
    } catch (err) {
        console.error("Error fetching properties by user ID:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};