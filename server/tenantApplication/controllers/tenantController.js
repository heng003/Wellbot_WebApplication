const Application = require('../../models/applicationModel');
const Property = require('../../models/propertyModel');
const User = require('../../models/propertyModel');
const createError = require('../../utils/appError');

const getAllProperties = async (req, res) => {
  try {
    const response = await Property.find().sort({ createdAt: -1 });
    console.log("Property List:", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

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


//GET user
const getUserProfile = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      res.json(user);
  } catch (err) {
      console.error("Error fetching user profile by user ID:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllProperties,
  getOneProperty,
  getUserProfile
};

/*
// GET property list
exports.getAllProperties = async (req, res, next) => {
    console.log(req.body)
    try {
        console.log(req.body)
        // Query to retrieve all properties
        const properties = await Property.find();

        console.log(properties.length)
        
        // Send the list of properties in the response
        res.status(200).json({
            status: 'success',
            data: properties
        });
    } catch (error) {
        console.error("Error fetching property list:", error);
        next(new createError("Internal Server Error", 404));
    }
};

// GET property list
exports.getPropertyDetails = async (req, res, next) => {
    console.log(req)
    try {
        const{propertyId} = req.body;
        const property = await Property.findOne({propertyId});
        if(!property)
            return next(new createError("Property not found",404));

        console.log(property)
        
        // Send the list of properties in the response
        res.status(200).json({
            status: 'success',
            data: properties
        });
    } catch (error) {
        console.error("Error fetching property:", error);
        next(new createError("Internal Server Error", 404));
    }
};*/

