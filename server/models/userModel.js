const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{ type:String, required: true,},
    email:{ type:String, unique: true, required: true,},
    phonenumber: {type:String, required: true},
    password: { type: String, required:true},
    role: { type: String, enum: ['landlord', 'tenant'], required: true},
});

const LandlordAcc = mongoose.model('LandlordAcc', userSchema);
module.exports = LandlordAcc;