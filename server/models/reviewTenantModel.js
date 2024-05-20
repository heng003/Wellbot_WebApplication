const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewTenantSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  landlordId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tenantRating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  commentTenant: {
    type: String,
    required: true,
    default: "No comment provided",
  },
  commentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReviewTenant", reviewTenantSchema);
