const mongoose = require("mongoose");
const { Schema } = mongoose;

// import { Schema, model } from "mongoose";

const leaseAgreementSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  landlordId: { type: Schema.Types.ObjectId, required: true },
  propertyId: { type: Schema.Types.ObjectId, required: true },
  applicationId: { type: Schema.Types.ObjectId, required: true },
  day: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: String, required: true },
  lessorName: { type: String, required: true },
  lessorIc: { type: String, required: true },
  lesseeName: { type: String, required: true },
  address: { type: String, required: true },
  effectiveDate: { type: String, required: true },
  expireDate: { type: String, required: true },
  rentRmWord: { type: String, required: true },
  rentRmNum: { type: Number, required: true },
  advanceDay: { type: Number, required: true },
  depositRmWord: { type: String, required: true },
  depositRmNum: { type: Number, required: true },
  lessorAdd: { type: String, required: true },
  lessorTel: { type: String, required: true },
  lessorFax: { type: String, required: true },
  lesseeAdd: { type: String, required: true },
  lesseeTel: { type: String, required: true },
  lesseeFax: { type: String, required: true },
  lessorDesignation: { type: String, required: true },
  lessorSignature: { type: String, required: true },
  lesseeIc: { type: String },
  lesseeDesignation: { type: String },
  // TODO: research how to implement saving pdf files with Buffer
  lesseeSignature: { type: String },
  completed: { type: Boolean, required: true, default: false },
  completedPDF: { data: Buffer, contentType: String },
});

const LeaseAgreement = mongoose.model("LeaseAgreement", leaseAgreementSchema);

module.exports = LeaseAgreement;

// export default LeaseAgreement;
