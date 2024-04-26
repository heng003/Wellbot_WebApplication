const express = require('express');
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/registerLandlordAcc', authController.registerLandlordAcc);
router.post('/registerTenantAcc', authController.registerTenantAcc);
router.post('/logIn', authController.logIn);

router.get('/confirmEmail/:token', authController.confirmEmail);
module.exports = router;