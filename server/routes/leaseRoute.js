const express = require('express');
const router = express.Router();
const leasesController = require('../controllers/leaseController');

// Endpoint to fetch leases by propertyId
router.get('/:propertyId', leasesController.getLeasesByPropertyId);
router.get('/tenant/:username', leasesController.getLeasesByTenantUsername);
router.get('/leasesAndProperties/tenant/:tenantId', leasesController.getLeasesAndPropertiesByTenantId);

module.exports = router;
