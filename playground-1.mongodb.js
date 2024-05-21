
use('RentSpotter');

db.getCollection('leases').insertOne({
  tenantId: ObjectId('663c7b00472233659b0e1a69'),
  propertyId: ObjectId('664770d50a1b773d78a1f9b7'),
  leaseStatus: "Under Review By Tenant",
  effectiveDateStart: null,
  effectiveDateEnd: null,
  PDF: null 
});

db.getCollection('leases').find().pretty();

