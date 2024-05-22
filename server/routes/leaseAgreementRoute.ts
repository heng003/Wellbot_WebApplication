import { Router } from "express";
import {
  submitLandlordLeaseAgreement,
  submitTenantLeaseAgreement,
} from "../controllers/leaseAgreementController";

const express = require("express");
const router: Router = express.Router();

const leaseAgreementController = require("../controllers/leaseAgreementController");

// TODO: add controller for get completed lease agreement
router.get("/completedLeaseAgreement/:id", submitLandlordLeaseAgreement);
router.post("/landlordLeaseAgreement", submitLandlordLeaseAgreement);
router.post("/tenantLeaseAgreement", submitTenantLeaseAgreement);
// router.post("/resetPassword/:id/:token", authController.resetPassword);

export default router;
