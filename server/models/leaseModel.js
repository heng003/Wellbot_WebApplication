const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaseSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  landlordId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  applicationId: { type: Schema.Types.ObjectId, required: true },
  leaseStatus: {
    type: String,
    enum: [
      "Pending",
      "Not Applicable",
      "Effective",
      "Expired",
      "Under Review By Tenant",
      "Signed",
    ],
    default: "Not Applicable",
    required: true,
  },
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
  lesseeSignature: { type: String },
  completed: { type: Boolean, required: true, default: false },
  PDF: { data: Buffer, contentType: String },
});

// Define virtual for landlordId
leaseSchema.virtual("virtualLandlordId").get(function () {
  if (this.propertyId) {
    return this.propertyId.landlordId;
  }
  return null;
});

// Ensure virtual fields are included when converting to JSON or Object
leaseSchema.set("toObject", { virtuals: true });
leaseSchema.set("toJSON", { virtuals: true });

const Lease = mongoose.model("Lease", leaseSchema);

module.exports = Lease;