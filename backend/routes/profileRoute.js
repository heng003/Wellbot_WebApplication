const express = require('express');
const router = express.Router();

const profileController = require("../controllers/profileController.js");

router.get('/userProfile', profileController.getUserProfile);
router.put('/userProfile', profileController.updateUserProfile);
router.post('/changePassword', profileController.changePassword);
router.post('/device/change', profileController.changeDevice);
router.patch('/guardianPermission', profileController.updateGuardianPermission);

module.exports = router;