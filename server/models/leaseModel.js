const mongoose = require("mongoose")
const { Schema } =  mongoose;

const leaseSchema = new Schema({
    propertyId:{ type: Schema.Types.ObjectId, ref:"Property",required:true},
    tenantId : { type: Schema.Types.ObjectId, ref:'User',required:true},
    leaseStatus : {type: String, enum: ['Pending','Not Applicable','Effective','Expired',"Under Review By Tenant","Signed"], default: 'Not Applicable', required: true },
    effectiveDateStart : {type: Date},
    effectiveDateEnd : {type: Date},
    PDF : {type: Buffer }
});

leaseSchema.virtual("landlordId").get(function(){
    if(this.propertyId){
        return this.propertyId.landlordId;
    }
    return null;
})

module.exports = mongoose.model('lease', leaseSchema);
