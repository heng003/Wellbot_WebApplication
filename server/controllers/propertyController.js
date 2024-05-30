const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

exports.getPropertyCountByLandlord = async (req, res) => {
  try {
      const { landlordId } = req.params;
      const propertyCount = await Property.countDocuments({ landlordId });

      if (!propertyCount) {
          return res.status(404).json({ message: 'No properties found for this landlord.' });
      }

      res.status(200).json({ propertyCount });
  } catch (err) {
      console.error('Error fetching property count:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};