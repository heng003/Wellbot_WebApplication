// import { Router } from "express";
// import {
//   submitLandlordLeaseAgreement,
//   submitTenantLeaseAgreement,
// } from "../controllers/leaseAgreementController";

const express = require("express");
const router = express.Router();

const {
  submitLandlordLeaseAgreement,
  submitTenantLeaseAgreement,
  getLeaseAgreement,
  savePDFToDB,
  getPDFFromDB,
} = require("../controllers/leaseAgreementController");

// TODO: add controller for get completed lease agreement
router.get("/getLeaseAgreement/:leaseAgreementId", getLeaseAgreement);
router.get("/getPDFFromDB/:leaseAgreementId", getPDFFromDB);
router.post(
  "/submitLandlordLeaseAgreement/:applicationId",
  submitLandlordLeaseAgreement
);
router.post(
  "/submitTenantLeaseAgreement/:leaseAgreementId",
  submitTenantLeaseAgreement
);
router.post("/savePDFToDB/:leaseAgreementId", savePDFToDB);
// router.post("/resetPassword/:id/:token", authController.resetPassword);

module.exports = router;
