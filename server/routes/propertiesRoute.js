const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertyController');

// Endpoint to fetch properties
router.get('/', propertiesController.getProperties);

// New route to get properties by user ID
router.get('/user/:userId', propertiesController.getPropertiesByUserId);

module.exports = router;