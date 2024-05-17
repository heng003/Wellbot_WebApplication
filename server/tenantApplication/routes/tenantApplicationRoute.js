const express = require('express');
const router = express.Router();

const tenantApplicationController = require("../controllers/tenantApplicationController");

router.get('/', tenantApplicationController.getAllProperties);

module.exports = router;