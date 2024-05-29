const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const multer = require('multer');
const sharp = require('sharp');
const TenantReview = require('../models/reviewTenantModel');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../client/src/LandlordPOV/component/ImagesUpload/');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    console.log('Setting filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });
const uploadPhotoMiddleware = upload.single('photo');

// Upload photo 1st page
const uploadPhoto = async (req, res) => {
  try {
    console.log('Upload photo endpoint hit');
    const propertyId = req.params.propertyId;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    console.log('Received propertyId:', propertyId);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await Property.updateOne({ _id: propertyId }, { $set: { coverPhoto: req.file.filename } });

    console.log("Image name: ", req.file.filename);

    // if (!property.coverPhoto) {
    //   property.coverPhoto = req.file.path;
    // } else {
    //   property.photos.push(req.file.path);
    // }

    // Save the updated property
    await property.save();
    console.log('Property saved successfully');
    res.status(200).json({ message: 'Photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Failed to upload photo' });
  }
};

// Upload photo 2nd page
const uploadPhotoNext = async (req, res) => {
  try {
    console.log('Upload photo endpoint hit');
    const propertyId = req.params.propertyId;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    console.log('Received propertyId:', propertyId);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!property.photos) {
      property.photos = [req.file.filename];
    } else {
      property.photos.push(req.file.filename);
    }

    console.log("Image name: ", req.file.filename);

    await property.save();
    console.log('Property saved successfully');
    res.status(200).json({ message: 'Photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Failed to upload photo' });
  }
};

// GET uploaded property photo
const getPropertyPhotos = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ensure coverPhoto is a string and photos is an array
    const coverPhoto = typeof property.coverPhoto === 'string' ? property.coverPhoto : null;
    const photos = Array.isArray(property.photos) ? property.photos : [];

    // // Extract coverPhoto and photos from the property document
    // const coverPhoto = property.coverPhoto;
    // const photos = property.photos;

    // Return the coverPhoto and photos to the frontend
    res.status(200).json({ coverPhoto, photos });
  } catch (error) {
    console.error('Error fetching property photos:', error);
    res.status(500).json({ message: 'Failed to fetch property photos' });
  }
};

// Make cover photo
const makeCoverPhoto = async (req, res) => {
  const { propertyId, photoId } = req.params;

  try {
      // Find the property by ID
      const property = await Property.findById(propertyId);
      if (!property) {
          return res.status(404).json({ message: 'Property not found' });
      }

      // Check if the photoId is a valid index in the photos array
    const photoIndex = parseInt(photoId);
    if (isNaN(photoIndex) || photoIndex < 0 || photoIndex >= property.photos.length) {
      return res.status(400).json({ message: 'Invalid photo ID' });
    }


      // Swap the coverPhoto with the selected photo
    const selectedPhoto = property.photos[photoIndex];
    property.photos.splice(photoIndex, 1); // Remove the selected photo from the array
    if (property.coverPhoto) {
      property.photos.push(property.coverPhoto); // Add the current cover photo to the end of the array
    }
    property.coverPhoto = selectedPhoto;
      // Save the property with the updated photos array and coverPhoto
      await property.save();

      res.status(200).json({ message: 'Cover photo updated successfully' });
  } catch (error) {
      console.error('Error updating cover photo:', error);
      res.status(500).json({ message: 'Failed to update cover photo' });
  }
};

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
  const { landlordId } = req.params;
  console.log("landlordId", req.params);
  console.log(req.body);

  try {
    // Validate that the landlord exists
    const landlord = await User.findById(landlordId);

    if (!landlord) {
      console.log("error finding landlord");
      return res.status(404).json({ error: "Landlord not found" });
    }

    // Create a new property
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

    console.log("Create property");

    // Save the new property
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const updatedData = req.body;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Update each field if new data is provided
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        property[key] = updatedData[key];
      }
    }

    // Save the updated property
    const updatedProperty = await property.save();
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Update photos
const updatePropertyWithPhotos = async (req, res) => {
  const { propertyId } = req.params;
  const { photos } = req.body;

  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Assign the first photo as the cover photo
    if (photos.length > 0) {
      property.coverPhoto = photos[0];
    }

    // Assign the rest of the photos to the photos array
    property.photos = photos.slice(1);

    // Save the updated property
    const updatedProperty = await property.save();
    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// To delete photo
const deletePhoto = async (req, res) => {
  const { propertyId, photoId } = req.params;

  try {
      // Find the property by ID
      const property = await Property.findById(propertyId).populate('coverPhoto photos');

      if (!property) {
          return res.status(404).json({ error: "Property not found" });
      }

      // Check if the photo to be deleted is the cover photo
      if (property.coverPhoto && property.coverPhoto._id.toString() === photoId) {
          // Remove the cover photo
          property.coverPhoto = null;
      }

      // Remove the photo from the photos array
      property.photos = property.photos.filter(photo => photo._id.toString() !== photoId);

      // Save the updated property
      await property.save();

      res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: err.message });
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

  //GET tenant by tenantId
const getTenant = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const response = await User.findById(tenantId);
    console.log("Tenant data: ", response)

    if (!response) {
      console.log("Tenant not found")
      return res.status(404).json({ error: "The tenant is not found" });
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

//GET Tenant Review by tenantId
const getTenantReview = async (req, res) => {
  const { tenantId } = req.params;

  try {
    const response = await TenantReview.find({ tenantId }).sort({ createdAt: -1 });

    console.log("Tenant Review: ", response)

    if (!response)
      return res.status(404).json({ error: "The tenant's review is not found" });

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
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyWithPhotos,
  deleteProperty,
  getLandlord,
  getTenant,
  getTenantReview,
  getUserProfile,
  uploadPhoto,
  uploadPhotoMiddleware,
  getPropertyPhotos,
  makeCoverPhoto,
  uploadPhotoNext,
  deletePhoto,
};
