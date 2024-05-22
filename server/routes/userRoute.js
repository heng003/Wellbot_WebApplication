const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users/:id', userController.getUserById);
router.get('/username/:username/landlordId', userController.getLandlordIdByUsername);

module.exports = router;
