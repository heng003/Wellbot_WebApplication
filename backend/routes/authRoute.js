const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");

router.post('/registerUserAcc', authController.registerUserAcc);
router.post('/registerGuardianAcc', authController.registerGuardianAcc);
router.post('/logIn', authController.logIn);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:id/:token/:role', authController.resetPassword);
router.get('/confirmEmail/:token', authController.confirmEmail);
router.get('/profile', authController.getUserProfile);
router.put('/profile', authController.updateUserProfile);
router.post('/changePassword', authController.changePassword);
router.post('/device/change', authController.changeDevice);
router.patch('/guardianPermission', authController.updateGuardianPermission);

module.exports = router;