const express = require('express');
const router = express.Router();

const fitbitController = require("../controllers/fitbitController");

router.post('/exchangetoken', fitbitController.exchangeToken);
// router.post('/fitbitoken', fitbitController.refreshAccessToken);
// router.post('/userdata', fitbitController.getFitbitData);

module.exports = router;