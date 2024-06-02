const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.get('/', tenantController.getAllProperties);
router.get('/condo', tenantController.getAllCondoProperties);
router.get('/commercial', tenantController.getAllComercialProperties);
router.get('/ViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantApplyForm/:userId', tenantController.getUserProfile);
router.get('/tenantApplyForm/:userId/:propertyId', tenantController.checkApplicationExists);
router.post('/tenantApplyForm', tenantController.createApplication);
router.get('/tenantApplication/:userId', tenantController.getApplications);
router.get('/landlord/:landlordId', tenantController.getLandlord);
router.get('/landlordReview/:landlordId', tenantController.getLandlordReview);
router.get('/tenantToLease/:applicationId', tenantController.getLeaseByApplicationId);
router.get('/property-details/:propertyId',  tenantController.getApplicationsWithDetailsByProperty);
router.get('/leases/tenants', tenantController.getLeasesByTenants);
router.get('/home/property', tenantController.getAllPropertiesWithoutActiveApplication);
router.get('/home/condo', tenantController.getCondoPropertiesWithoutActiveApplication);
router.get('/home/commercial', tenantController.getCommercialPropertiesWithoutActiveApplication);

module.exports = router;