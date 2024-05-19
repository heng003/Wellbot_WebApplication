const express = require('express');
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.get('/', tenantController.getAllProperties);
router.get('/ViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantViewProperty/:propertyId', tenantController.getOneProperty);
router.get('/tenantApplyForm', tenantController.getUserProfile);

module.exports = router;