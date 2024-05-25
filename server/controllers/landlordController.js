const Property = require('../models/propertyModel');

//GET All Properties
const getAllProperties = async (req, res) => {
    try {
      const response = await Property.find().sort({ createdAt: -1 });
      console.log("Property List:", response);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  //GET All Condo Properties
  const getAllCondoProperties = async (req, res) => {
    try {
      const response = await Property.find({ type: 'Condo' }).sort({ createdAt: -1 });
      console.log("Condo List:", response);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  //GET All Commercial Properties
  const getAllComercialProperties = async (req, res) => {
    try {
      const response = await Property.find({ type: 'Commercial' }).sort({ createdAt: -1 });
      console.log("Commercial List:", response);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  //GET One Property by propertyId
  const getOneProperty = async (req, res) => {
    const { propertyId } = req.params;
  
    console.log("Property Id: " + propertyId);
  
    try {
      const response = await Property.findById(propertyId);
  
      if (!response)
        return res.status(404).json({ error: "The post is not found" });
  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

// Get all properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single property
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a property
const createProperty = async (req, res) => {
  const property = new Property({
    landlordId: req.body.landlordId,
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

  try {
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update only the fields that are present in the request body
    Object.assign(property, req.body);

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.remove();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET Landlord by landlordId
const getLandlord = async (req, res) => {
    const { landlordId } = req.params;
  
    try {
      const response = await User.findById(landlordId);
      console.log("Landlord data: ", response)
  
      if (!response) {
        console.log("Landlord not found")
        return res.status(404).json({ error: "The landlord is not found" });
      }
  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

//GET user by userId
const getUserProfile = async (req, res) => {
  try {
      const userId = req.params.userId;
      console.log("User id: " + userId)
      const user = await User.findById(userId);
      res.json(user);
  } catch (err) {
      console.error("Error fetching user profile by user ID:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
  

module.exports = {
  getAllProperties,
  getAllCondoProperties,
  getAllComercialProperties,
  getOneProperty,
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlord,
  getUserProfile
};
