import { Schema, Types, model } from "mongoose";

interface IApprovedApplication {
  tenantId: Types.ObjectId;
  landlordId: Types.ObjectId;
  propertyId: Types.ObjectId;
}

const approvedApplicationSchema = new Schema<IApprovedApplication>({
  tenantId: { type: Schema.Types.ObjectId, required: true },
  landlordId: { type: Schema.Types.ObjectId, required: true },
  propertyId: { type: Schema.Types.ObjectId, required: true },
});

const ApprovedApplication = model<IApprovedApplication>(
  "ApprovedApplication",
  approvedApplicationSchema
);

export default ApprovedApplication;
