const express = require('express');
const router = express.Router();

const tenantController = require("../controllers/tenantController");

router.get('/', tenantController.getAllProperties);
router.get('/ViewProperty/:userId', tenantController.getOneProperty);

module.exports = router;