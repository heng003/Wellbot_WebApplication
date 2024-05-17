const express = require('express');
const router = express.Router();
const leasesController = require('../controllers/leaseController');

// Endpoint to fetch leases by propertyId
router.get('/:propertyId', leasesController.getLeasesByPropertyId);

module.exports = router;
