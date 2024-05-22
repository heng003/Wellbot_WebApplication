const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { createReview, getLandlordReviews } = require('../controllers/reviewLandlordController');

router.post('/landlord', createReview);
router.get('/landlord/:landlordId', getLandlordReviews);

module.exports = router;