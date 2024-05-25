const express = require('express');
const router = express.Router();
const landlordController = require('../controllers/landlordController');

router.get('/', landlordController.getAllProperties);
router.get('/condo', landlordController.getAllCondoProperties);
router.get('/commercial', landlordController.getAllComercialProperties);
router.get('/landlordViewProperty/:propertyId', landlordController.getOneProperty);

router.get('/properties', landlordController.getProperties);
router.get('/properties/:id', landlordController.getPropertyById);
router.post('/properties', landlordController.createProperty);
router.put('/properties/:id', landlordController.updateProperty);
router.delete('/properties/:id', landlordController.deleteProperty);
router.get('/landlordProperties/:landlordId', landlordController.getLandlord);
router.get('/properties/:landlordId', landlordController.getUserProfile);

module.exports = router;
