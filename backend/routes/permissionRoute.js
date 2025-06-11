const express = require('express');
const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.get('/guardian/getMonitoredList/:guardianId', permissionController.getMonitoredList);
router.post('/guardian/createPermission', permissionController.createPermission);
router.delete('/guardian/deletePermission', permissionController.deletePermission);

module.exports = router;