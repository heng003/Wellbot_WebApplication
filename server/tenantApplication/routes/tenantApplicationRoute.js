const express = require('express');
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.get('/', tenantController.getAllProperties);
router.get('/ViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantApplyForm/:userId', tenantController.getUserProfile);
router.get('/tenantApplyForm/:userId/:propertyId', tenantController.checkApplicationExists);
router.post('/tenantApplyForm', tenantController.createApplication);
router.get('/tenantApplication/:userId', tenantController.getApplications);
router.get('/landlord/:landlordId', tenantController.getLandlord);
router.get('/landlordReview/:landlordId', tenantController.getLandlordReview);

module.exports = router;