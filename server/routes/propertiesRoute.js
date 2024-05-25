const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertyController');

router.get('/', propertiesController.getProperties);
router.get('/user/:userId', propertiesController.getPropertiesByUserId);
router.get('/landlord/:landlordId/propertyCount', propertiesController.getPropertyCountByLandlord);

module.exports = router;