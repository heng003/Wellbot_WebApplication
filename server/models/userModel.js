const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{ type:String, required: true,},
    email:{ type:String, unique: true, required: true,},
    phonenumber: {type:String, required: true},
    password: { type: String, required:true},
    role: { type: String, enum: ['landlord', 'tenant'], required: true},
    verified: {type: Boolean, default:false},
    verificationToken: { type: String },
    tokenExpires: { type: Date, required: false } 
});

const LandlordAcc = mongoose.model('user', userSchema);
module.exports = LandlordAcc;