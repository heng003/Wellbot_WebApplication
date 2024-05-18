
use('RentSpotter');

db.getCollection('leases').insertOne({
  tenantId: ObjectId('664769620ed78e6720cfbb50'),
  propertyId: ObjectId('664770d50a1b773d78a1f9b6'),
  leaseStatus: "Expired",
  effectiveDateStart: new Date("21/1/2024"),
  effectiveDateEnd: new Date('21/4/2025'),
  PDF: null 
});

db.getCollection('leases').find().pretty();

