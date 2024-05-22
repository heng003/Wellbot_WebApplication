const mongoose = require("mongoose");
const { Schema } = mongoose;

const approvedApplicationSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  landlordId: { type: Schema.Types.ObjectId, required: true },
  propertyId: { type: Schema.Types.ObjectId, required: true },
});

const ApprovedApplication = mongoose.model(
  "ApprovedApplication",
  approvedApplicationSchema
);

module.exports = ApprovedApplication;
