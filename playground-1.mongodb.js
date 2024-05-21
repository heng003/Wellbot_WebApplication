
use('RentSpotter');

db.getCollection('leases').insertOne({
  tenantId: ObjectId('66476ac5b0038fdc720f973d'),
  propertyId: ObjectId('6647463426c3fcb36876c1e4'),
  leaseStatus: "Expired",
  effectiveDateStart: new Date("21/1/2021"),
  effectiveDateEnd: new Date('21/4/2022'),
  PDF: null 
});

db.getCollection('leases').find().pretty();

