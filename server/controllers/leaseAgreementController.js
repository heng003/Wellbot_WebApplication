const Lease = require("../models/leaseModel");
require("dotenv").config();
const Property = require("../models/propertyModel");
const Application = require("../models/applicationModel");
const puppeteer = require("puppeteer");
const pdfMaster = require("pdf-master");
// var Buffer = require("buffer/").Buffer;
const base64 = require("base64topdf");

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
  // const leaseAgreementId = req.params.leaseAgreementId;
  const applicationId = req.params.applicationId;
  if (!applicationId)
    res
      .status(400)
      .json({ status: "fail", message: "Application ID is required" });
  try {
    const application = await Application.findOne({ _id: applicationId });
    // const existingLeaseAgreement = await Lease.findOne({
    //   _id: leaseAgreementId,
    // });
    if (!application) {
      res.status(400).json({
        status: "fail",
        message: "Application not found",
      });
      return;
    }
    const propertyId = application.propertyId;
    const tenantId = application.tenantId;
    // const property = await Property.findOne({ _id: propertyId });
    const landlordId = application.landlordId;

    const existingLeaseAgreement = await Lease.findOne({
      applicationId,
    });

    if (existingLeaseAgreement) {
      const oldLeaseAgreement = await Lease.findOneAndUpdate(
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
      await Application.findOneAndUpdate(
        {
          _id: applicationId,
        },
        { applicationStatus: "Approved" }
      );
      res.status(200).json({
        status: "success",
        message: "Lease Agreement updated successfully",
        leaseAgreementId: oldLeaseAgreement._id,
      });
      return;
    } else {
      const newLease = await Lease.create({
        tenantId,
        landlordId,
        propertyId,
        applicationId,
        leaseStatus: "Under Review By Tenant",
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
        { applicationStatus: "Approved" }
      );
      console.log(newLease._id);
      res.status(200).json({
        status: "success",
        message: "Lease Agreement sent successfully",
        leaseAgreementId: newLease._id,
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
          leaseStatus: "Effective",
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
  const leaseAgreementId = req.params.leaseAgreementId;
  try {
    const existingLeaseAgreement = await Lease.findOne({
      _id: leaseAgreementId,
    });

    if (existingLeaseAgreement) {
      console.log("Existing Lease: ", existingLeaseAgreement);
      res.status(200).json({
        status: "success",
        message: "Lease Agreement found",
        leaseAgreement: existingLeaseAgreement,
      });
    } else {
      return { message: "Lease Agreement not found" };
    }
  } catch (error) {
    console.log("Failed to retrieve lease agreement", error);
    next(error);
  }
};

exports.savePDFToDB = async (req, res, next) => {
  const leaseAgreementId = req.params.leaseAgreementId;
  const { pdfBase64 } = req.body;
  try {
    const existingLeaseAgreement = await Lease.findOne({
      _id: leaseAgreementId,
    });
    if (!existingLeaseAgreement) {
      res.status(400).json({
        status: "fail",
        message: "Lease Agreement not found",
      });
      return;
    }
    const response = await Lease.findOneAndUpdate(
      { _id: leaseAgreementId },
      { PDF: pdfBase64 }
    );
    res.status(200).json({
      status: "success",
      message: "PDF File saved successfully",
    });
    // const data = {
    //   day: existingLeaseAgreement.day,
    //   month: existingLeaseAgreement.month,
    //   year: existingLeaseAgreement.year,
    //   lessorName: existingLeaseAgreement.lessorName,
    //   lessorIc: existingLeaseAgreement.lessorIc,
    //   lesseeName: existingLeaseAgreement.lesseeName,
    //   address: existingLeaseAgreement.address,
    //   effectiveDate: existingLeaseAgreement.effectiveDate,
    //   expireDate: existingLeaseAgreement.expireDate,
    //   rentRmWord: existingLeaseAgreement.rentRmWord,
    //   rentRmNum: existingLeaseAgreement.rentRmNum,
    //   advanceDay: existingLeaseAgreement.advanceDay,
    //   depositRmWord: existingLeaseAgreement.depositRmWord,
    //   depositRmNum: existingLeaseAgreement.depositRmNum,
    //   lessorAdd: existingLeaseAgreement.lessorAdd,
    //   lessorTel: existingLeaseAgreement.lessorTel,
    //   lessorFax: existingLeaseAgreement.lessorFax,
    //   lesseeAdd: existingLeaseAgreement.lesseeAdd,
    //   lesseeTel: existingLeaseAgreement.lesseeTel,
    //   lesseeFax: existingLeaseAgreement.lesseeFax,
    //   lessorDesignation: existingLeaseAgreement.lessorDesignation,
    //   lessorSignature: existingLeaseAgreement.lessorSignature,
    //   lesseeIc: existingLeaseAgreement.lesseeIc,
    //   lesseeDesignation: existingLeaseAgreement.lesseeDesignation,
    //   lesseeSignature: existingLeaseAgreement.lesseeSignature,
    // };
    // const pdf = await pdfMaster.generatePdf("pdfTemplate.hbs", data);
    // res.contentType("application/pdf");
    // res.status(200).json({
    //   status: "success",
    //   message: "PDF File genereated successfully",
    //   pdfFile: pdf,
    // });
  } catch (error) {
    console.log("Failed to generate PDF", error);
    next(error);
  }
};

exports.getPDFFromDB = async (req, res, next) => {
  const leaseAgreementId = req.params.leaseAgreementId;
  try {
    const existingLeaseAgreement = await Lease.findOne({
      _id: leaseAgreementId,
    });
    if (!existingLeaseAgreement) {
      res.status(400).json({
        status: "fail",
        message: "Lease Agreement not found",
      });
      return;
    }
    const base64Str = existingLeaseAgreement.PDF;
    const downloadUrl = "data:application/pdf;base64," + base64Str;
    //   res.type("application/pdf");
    // res.header("Content-Disposition", attachment; filename="lease.pdf");

    // const buffer = Buffer.from(base64Str, "base64");
    // console.log(buffer);
    // res.send(Buffer.from(base64Str, "base64"));
    res.status(200).json({
      status: "success",
      message: "PDF File retrieved successfully",
      url: downloadUrl,
    });
  } catch (error) {
    console.log("Failed to retrieve PDF", error);
    next(error);
  }
};