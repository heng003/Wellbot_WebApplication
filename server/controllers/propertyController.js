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
    const { userId } = req.params; 
    const token = req.headers.authorization.split(" ")[1];
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  
      if (decodedToken.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      const properties = await Property.find({ landlordId: userId });
      res.status(200).json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ message: 'Failed to fetch properties' });
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


// Get landlord ID by property ID
exports.getLandlordIdByPropertyId = async (req, res) => {
    const { propertyId } = req.params;
  
    try {
      const property = await Property.findById(propertyId).populate('landlordId');
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      const landlordId = property.landlordId._id;
      res.json({ landlordId });
    } catch (error) {
      console.error('Error fetching landlord ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get landlord ID by user ID
  exports.getLandlordIdByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const property = await Property.findOne({ landlordId: userId }).populate('landlordId');
      if (!property) {
        return res.status(404).json({ error: 'Property not found for the given user ID' });
      }
  
      const landlordId = property.landlordId._id;
      res.json({ landlordId });
    } catch (error) {
      console.error('Error fetching landlord ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.getLandlordId = async (req, res) => {
    try {
      const landlordId = req.params.landlordId;
      console.log("Landlord id: " + landlordId)
      const properties = await Property.findById(landlordId);
      res.json(properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  //POST New Properties Record
exports.createProperty  = async (req, res) => {
  const {landlordId} = req.body;

  try {
    // Validate that the property exist
    const landlord = await User.findById(landlordId);


    if (!landlord) {
      return res.status(404).json({ error: "Landlord not found" });
    }

    // Create a new application
    const property = new Property({
      landlordId: landlordId,
      name: req.body.name,
      type: req.body.type,
      address: req.body.address,
      location: req.body.location,
      postcode: req.body.postcode,
      bedroom: req.body.bedroom,
      bathroom: req.body.bathroom,
      furnishing: req.body.furnishing,
      parking: req.body.parking,
      floorLevel: req.body.floorLevel,
      buildUpSize: req.body.buildUpSize,
      facilities: req.body.facilities,
      accessibility: req.body.accessibility,
      price: req.body.price,
      description: req.body.description,
      coverPhoto: req.body.coverPhoto,
      photos: req.body.photos
    });

    // Save the property to the database
    const newProperty = await Property.save();

    console.log("New application created:", newProperty);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: error.message });
  }
};