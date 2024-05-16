const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantSchema = new Schema({
    name: String,
    rating: Number,
    leaseStatus : String
  });
  
  const propertySchema = new Schema({
    name: String,
    price: Number,
    type: String,
    tenants: [tenantSchema]
  });

const userSchema = new mongoose.Schema({
    username:{ type:String, required: true,},
    email:{ type:String, unique: true, required: true,},
    phonenumber: {type:String, required: true},
    fullname:{ type:String},
    ic:{type:String},
    password: { type: String, required:true},
    role: { type: String, enum: ['landlord', 'tenant'], required: true},
    verified: {type: Boolean, default:false},
    verificationToken: { type: String },
    tokenExpires: { type: Date, required: false },
    tokenEmail: { type: String },
    properties: [propertySchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;