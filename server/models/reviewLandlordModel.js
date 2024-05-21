const mongoose = require("mongoose")
const { Schema } =  mongoose;

const reviewLandlordSchema = new Schema({
    landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    landlordRating: { type: Number, required: true, min:0, max:5, default:0 },
    commentLandlord: { type: String, required: true, default: "No comment provided"},
    commentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("reviewlandlords", reviewLandlordSchema);