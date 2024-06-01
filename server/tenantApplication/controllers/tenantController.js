const { response } = require('express');
const Application = require('../../models/applicationModel');
const Property = require('../../models/propertyModel');
const Lease = require('../../models/leaseModel');
const LandlordReview = require('../../models/reviewLandlordModel');
const User = require('../../models/userModel');
const createError = require('../../utils/appError');

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

//POST New Application Record
const createApplication  = async (req, res) => {
  const {userId, propertyId, landlordId} = req.body;

  try {
    // Validate that the user and property exist
    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    const landlord = await User.findById(landlordId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    if (!landlord) {
      return res.status(404).json({ error: "Landlord not found" });
    }

    // Create a new application
    const newApplication = new Application({
      tenantId: userId,
      propertyId: propertyId,
      landlordId: landlordId,
      applicationStatus: 'Pending', // Default status
    });

    // Save the application to the database
    const savedApplication = await newApplication.save();

    console.log("New application created:", savedApplication);
    return res.status(201).json(savedApplication);
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: error.message });
  }
};

//GET Application to check for existing application
const checkApplicationExists = async (req, res) => {
  const { userId, propertyId } = req.params;

  try {
    const existingApplication = await Application.findOne({ tenantId: userId, propertyId: propertyId });

    if (existingApplication) {
      console.log("Property Exist");
      return res.status(200).json({ exists: true });
    } else {
      console.log("Property Not Exist");
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking application existence:", error);
    return res.status(500).json({ error: error.message });
  }
};

//GET Applications by userId (exclue ACTIVE application)
const getApplications = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("User id: " + userId);

    // Find applications by tenantId and exclude those with applicationStatus "Active"
    const response = await Application.find({ tenantId: userId, applicationStatus: { $ne: "Active" } }).sort({ createdAt: -1 });
    console.log("Application List: ", response);

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching user profile by user ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
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

//GET Landlord Review by landlordId
const getLandlordReview = async (req, res) => {
  const { landlordId } = req.params;

  try {
    const response = await LandlordReview.find({ landlordId: landlordId }).sort({ createdAt: -1 });

    console.log("Landlord Review: ", response)

    if (!response)
      return res.status(404).json({ error: "The landlord's review is not found" });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


//GET lease by applicationId
const getLeaseByApplicationId = async (req, res) => {
  const { applicationId } = req.params;

  try {
    const response = await Lease.findOne({ applicationId: applicationId });
    console.log("Lease data: ", response)

    if (!response) {
      console.log("Lease not found")
      return res.status(404).json({ error: "The lease is not found" });
    }

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET Applications by Property ID
const getApplicationsByProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const applications = await Application.find({ propertyId }).populate('tenantId');
    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications by property ID:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET Leases by Tenant IDs
const getLeasesByTenants = async (req, res) => {
  const { tenantIds } = req.query;
  try {
    const tenantIdArray = tenantIds.split(','); // Split the comma-separated string into an array
    const leases = await Lease.find({ tenantId: { $in: tenantIdArray } });
    return res.status(200).json(leases);
  } catch (error) {
    console.error("Error fetching leases by tenant IDs:", error);
    return res.status(500).json({ error: error.message });
  }
};

// GET All Properties but drop the property with Active Application
const getAllPropertiesWithoutActiveApplication = async (req, res) => {
  try {
    const activeApplication = await Application.find({ applicationStatus: 'Active' }).distinct('propertyId');

    const response = await Property.aggregate([
      {
        $match: {
          _id: { $nin: activeApplication }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("Properties without Active Application:", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET Condo Properties but drop the property with Active Application
const getCondoPropertiesWithoutActiveApplication = async (req, res) => {
  try {
    const activeApplication = await Application.find({ applicationStatus: 'Active' }).distinct('propertyId');

    const response = await Property.aggregate([
      {
        $match: {
          _id: { $nin: activeApplication },
          type: 'Condo' 
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("Properties without Active Application and of type 'Condo':", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET Commercial Properties but drop the property with Active Application
const getCommercialPropertiesWithoutActiveApplication = async (req, res) => {
  try {
    const activeApplication = await Application.find({ applicationStatus: 'Active' }).distinct('propertyId');

    const response = await Property.aggregate([
      {
        $match: {
          _id: { $nin: activeApplication },
          type: 'Commercial' 
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("Properties without Active Application and of type 'Condo':", response);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllProperties,
  getAllCondoProperties,
  getAllComercialProperties,
  getOneProperty,
  getUserProfile,
  checkApplicationExists,
  createApplication,
  getApplications,
  getLandlord,
  getLandlordReview,
  getLeaseByApplicationId,
  getApplicationsByProperty,
  getLeasesByTenants,
  getAllPropertiesWithoutActiveApplication,
  getCondoPropertiesWithoutActiveApplication,
  getCommercialPropertiesWithoutActiveApplication
};