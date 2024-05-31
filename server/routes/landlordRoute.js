const express = require('express');
const router = express.Router();
const landlordController = require('../controllers/landlordController');

router.get('/', landlordController.getAllProperties);
router.get('/condo', landlordController.getAllCondoProperties);
router.get('/commercial', landlordController.getAllComercialProperties);
router.get('/landlordViewProperty/:propertyId', landlordController.getOneProperty);
router.get('/properties', landlordController.getProperties);
router.get('/properties/:propertyId', landlordController.getPropertyById);
router.post('/properties/upload/:landlordId', landlordController.createProperty);
router.put('/properties/update/:propertyId', landlordController.updateProperty);
router.put('/properties/updatePhoto/:propertyId', landlordController.updatePropertyWithPhotos);
router.put('/properties/uploadPhoto/:propertyId', landlordController.uploadPhotoMiddleware, landlordController.uploadPhoto);
router.get('/properties/uploadPhoto/getPhoto/:propertyId', landlordController.getPropertyPhotos);
router.put('/properties/uploadPhotoNext/:propertyId', landlordController.uploadPhotoMiddleware, landlordController.uploadPhotoNext);
router.put('/properties/makeCoverPhoto/:propertyId/:photoId', landlordController.makeCoverPhoto);
router.delete('/properties/:propertyId/deletePhoto/:photoId', landlordController.deletePhoto);
router.delete('/properties/:id', landlordController.deleteProperty);
router.get('/landlordProperties/:landlordId', landlordController.getLandlord);
router.get('/tenant/:tenantId', landlordController.getTenant);
router.get('/tenantReview/:tenantId', landlordController.getTenantReview);
router.get('/properties/:landlordId', landlordController.getUserProfile);

module.exports = router;
