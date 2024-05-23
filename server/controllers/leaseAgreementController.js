const Lease = require("../models/leaseModel");
require("dotenv").config();
const Property = require("../models/propertyModel");
const Application = require("../models/applicationModel");
const puppeteer = require("puppeteer");

exports.submitLandlordLeaseAgreement = async (req, res, next) => {
  const {
    day,
    month,
    year,
    lessorName,
    lessorIc,
    lesseeName,
    address,
    effectiveDate,
    expireDate,
    rentRmWord,
    rentRmNum,
    advanceDay,
    depositRmWord,
    depositRmNum,
    lessorAdd,
    lessorTel,
    lessorFax,
    lesseeAdd,
    lesseeTel,
    lesseeFax,
    lessorDesignation,
    lessorSignature,
  } = req.body;
  const applicationId = req.params.applicationId;
  if (!applicationId)
    res
      .status(400)
      .json({ status: "fail", message: "Application ID is required" });
  try {
    const application = await Application.findOne({ _id: applicationId });
    const propertyId = application?.propertyId;
    const tenantId = application?.tenantId;
    const property = await Property.findOne({ _id: propertyId });
    const landlordId = property?.landlordId;
    const existingLeaseAgreement = await Lease.findOne({
      applicationId,
    });
    if (existingLeaseAgreement) {
      await Lease.findOneAndUpdate(
        { _id: existingLeaseAgreement._id },
        {
          day,
          month,
          year,
          lessorName,
          lessorIc,
          lesseeName,
          address,
          effectiveDate,
          expireDate,
          rentRmWord,
          rentRmNum,
          advanceDay,
          depositRmWord,
          depositRmNum,
          lessorAdd,
          lessorTel,
          lessorFax,
          lesseeAdd,
          lesseeTel,
          lesseeFax,
          lessorDesignation,
          lessorSignature,
        }
      );
      res.status(200).json({
        status: "success",
        message: "Lease Agreement updated successfully",
      });
      return;
    } else {
      await Lease.create({
        tenantId,
        landlordId,
        propertyId,
        applicationId,
        day,
        month,
        year,
        lessorName,
        lessorIc,
        lesseeName,
        address,
        effectiveDate,
        expireDate,
        rentRmWord,
        rentRmNum,
        advanceDay,
        depositRmWord,
        depositRmNum,
        lessorAdd,
        lessorTel,
        lessorFax,
        lesseeAdd,
        lesseeTel,
        lesseeFax,
        lessorDesignation,
        lessorSignature,
      });
      await Application.findOneAndUpdate(
        { _id: applicationId },
        { status: "Approved" }
      );
      res.status(200).json({
        status: "success",
        message: "Lease Agreement sent successfully",
        data: { leaseAgreement: existingLeaseAgreement },
      });
    }
  } catch (error) {
    console.log("Failed to send lease agreement:", error);
    next(error);
  }
};

exports.submitTenantLeaseAgreement = async (req, res, next) => {
  const { lesseeIc, lesseeDesignation, lesseeSignature } = req.body;
  const leaseAgreementId = req.params.leaseAgreementId;
  try {
    const existingLeaseAgreement = await Lease.findOne({
      _id: leaseAgreementId,
    });

    if (existingLeaseAgreement) {
      await Lease.findOneAndUpdate(
        { _id: existingLeaseAgreement._id },
        {
          lesseeIc,
          lesseeDesignation,
          lesseeSignature,
          completed: true,
        }
      );
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const website_url = "http://localhost:3000/viewAgreement";
      await page.goto(website_url, { waitUntil: "networkidle0" });
      await page.emulateMediaType("screen");
      const pdf = await page.pdf({
        path: "agreement.pdf",
        margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
        printBackground: true,
        format: "A4",
      });
      await Lease.findOneAndUpdate(
        { _id: existingLeaseAgreement._id },
        {
          PDF: { data: pdf, contentType: "application/pdf" },
        }
      );
    } else {
      return { message: "Lease Agreement not found" };
    }

    res.status(200).json({
      status: "success",
      message: "Lease Agreement completed",
    });
  } catch (error) {
    console.log("Failed to complete lease agreement", error);
    next(error);
  }
};

exports.getLeaseAgreement = async (req, res, next) => {
  const { leaseAgreementId } = req.params.leaseAgreementId;
  try {
    const existingLeaseAgreement = await Lease.findOne({
      _id: leaseAgreementId,
    });

    if (existingLeaseAgreement) {
      res.status(200).json({
        status: "success",
        message: "Lease Agreement found",
        data: { leaseAgreement: existingLeaseAgreement },
      });
    } else {
      return { message: "Lease Agreement not found" };
    }
  } catch (error) {
    console.log("Failed to retrieve lease agreement", error);
    next(error);
  }
};
