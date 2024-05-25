const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertyController');

router.get('/', propertiesController.getProperties);
router.get('/user/:userId', propertiesController.getPropertiesByUserId);
router.get('/landlord/:landlordId/propertyCount', propertiesController.getPropertyCountByLandlord);
router.get('/property/:propertyId/landlord', propertiesController.getLandlordIdByPropertyId);
router.get('/user/:userId/landlord', propertiesController.getLandlordIdByUserId);
router.get('/:landlordId', propertiesController.getLandlordId);
router.get('/newproperty', propertiesController.createProperty);


module.exports = router;