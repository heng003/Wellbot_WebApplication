const mongoose = require("mongoose")
const { Schema } =  mongoose;

const commentByLandlordSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tenantRating: { type: Number, required: true, default:0 },
    commentTenant: { type: String, required: true },
    commentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('commentByLandlord', commentByLandlordSchema);
