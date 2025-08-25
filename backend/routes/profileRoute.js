const express = require('express');
const router = express.Router();

const profileController = require("../controllers/profileController.js");

router.get('/userProfile', profileController.getUserProfile);
router.put('/userProfile', profileController.updateUserProfile);
router.post('/changePassword', profileController.changePassword);
router.post('/changeDevice', profileController.changeDevice);
router.patch('/guardianPermission', profileController.updateGuardianPermission);
router.patch('/preferIntervention', profileController.updatePreferIntervention);

module.exports = router;