const express = require('express');
const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.get('/guardian/getMonitoredList/:guardianId', permissionController.getMonitoredList);
router.post('/guardian/createPermission', permissionController.createPermission);
router.delete('/guardian/deletePermission', permissionController.deletePermission);
router.get('/user/getPendingRequests/:userId', permissionController.getPendingRequests);
router.get('/user/getActiveGuardians/:userId', permissionController.getActiveGuardians);
router.post('/user/createActivePermission', permissionController.createActivePermission);
router.delete('/user/deletePermission', permissionController.deleteUserPermission);
router.patch('/user/updateRequestStatus', permissionController.updateRequestStatus);
router.get('/user/activeCount', permissionController.getActiveGuardianCount);
router.get('/guardian/getActiveWards/:guardianId', permissionController.getActiveWards);

module.exports = router;