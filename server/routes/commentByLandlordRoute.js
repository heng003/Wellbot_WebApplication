const express = require('express');
const router = express.Router();
const commentByLandlord = require('../controllers/commentByLandlordController');

router.post('/commentByLandlord', commentByLandlord.createComment);

module.exports = router;
