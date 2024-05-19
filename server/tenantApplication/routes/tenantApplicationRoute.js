const express = require("express");
const router = express.Router();
const authenticate = require("../middlwares/userIdMiddleware");
const tenantController = require("../controllers/tenantController");

router.get("/", authenticate, tenantController.getAllProperties);
router.get(
  "/ViewProperty/:propertyId",
  authenticate,
  tenantController.getOneProperty
);
router.get(
  "/tenantViewProperty/:propertyId",
  authenticate,
  tenantController.getOneProperty
);
router.get("/tenantApplyForm", authenticate, tenantController.getUserProfile);

module.exports = router;
