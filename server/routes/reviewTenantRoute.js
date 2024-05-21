const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { createReview, getTenantReviews} = require('../controllers/reviewTenantController');

router.post('/tenant', createReview);
router.get('/tenant/:tenantId', getTenantReviews);

module.exports = router;