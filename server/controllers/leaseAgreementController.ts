import LeaseAgreement from "../models/leaseAgreementModel";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import Property from "../models/propertyModel";
import Application from "../models/applicationModel";
import ApprovedApplication from "../models/approvedApplication";

const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY as Secret;

interface DecodedToken {
  userId: string;
}

export const submitLandlordLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    // if (req.headers.authorization) {
    //   const token = req.headers.authorization.split(" ")[1];
    //   const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    //   const user = await User.findOne({ _id: decoded.userId });
    //   const properties = user?.properties;
    //   const applications = Application.find({ propertyId: {$in: properties}})
    //   if (!applications) {
    //     res.status(404).json({
    //       status: "fail",
    //       message: "No applications found"
    //     })
    //   }

    // }
    const existingLeaseAgreement = await LeaseAgreement.findOne({
      tenantId,
      landlordId,
      propertyId,
    });
    if (existingLeaseAgreement) {
      await LeaseAgreement.findOneAndUpdate(
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
    } else {
      await LeaseAgreement.create({
        tenantId,
        landlordId,
        propertyId,
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
    }
    res.status(200).json({
      status: "success",
      message: "Lease Agreement sent successfully",
    });
  } catch (error) {
    console.log("Failed to send lease agreement:", error);
    next(error);
  }
};

export const submitTenantLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lesseeIc, lesseeDesignation, lesseeSignature } = req.body;
  const approvedApplicationId = req.params.approvedApplicationId;
  const approvedApplication = await ApprovedApplication.findOne({
    _id: approvedApplicationId,
  });
  const propertyId = approvedApplication?.propertyId;
  const tenantId = approvedApplication?.tenantId;
  const landlordId = approvedApplication?.landlordId;
  try {
    const existingLeaseAgreement = await LeaseAgreement.findOne({
      tenantId,
      landlordId,
      propertyId,
    });

    if (existingLeaseAgreement) {
      await LeaseAgreement.findOneAndUpdate(
        { _id: existingLeaseAgreement._id },
        {
          lesseeIc,
          lesseeDesignation,
          lesseeSignature,
          completed: true,
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

export const getCompletedLeaseAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lessorId = req.params.lessorId;
  const lesseeId = req.params.lesseeId;
  try {
    const existingLeaseAgreement = await LeaseAgreement.findOne({
      _id: { $regex: lessorId + "_" + lesseeId, $options: "i" },
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
