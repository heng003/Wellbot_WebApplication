const express = require('express');
const router = express.Router();
const leasesController = require('../controllers/leaseController');

// Endpoint to fetch leases by propertyId
router.get('/:propertyId', leasesController.getLeasesByPropertyId);

// Endpoint to fetch leases by tenant username
router.get('/tenant/:username', leasesController.getLeasesByTenantUsername);

module.exports = router;
