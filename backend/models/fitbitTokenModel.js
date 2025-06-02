const mongoose = require('mongoose');
const { Schema } = mongoose;

const fitbitTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const FitbitToken = mongoose.model("FitbitToken ", fitbitTokenSchema);

module.exports = FitbitToken;
