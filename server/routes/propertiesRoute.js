const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/properties', authMiddleware, propertiesController.getProperties);

module.exports = router;
