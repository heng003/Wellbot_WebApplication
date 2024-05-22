
use('RentSpotter');

db.getCollection('leases').insertOne({
  tenantId: new ObjectId('663c7b00472233659b0e1a69'),
  propertyId: new ObjectId("664ddfc3dc896d35b58501d3"),
  leaseStatus: "Expired",
  effectiveDateStart: "2022-07-01T00:00:00.000+00:00",
  effectiveDateEnd: "2023-07-01T00:00:00.000+00:00",
  PDF: null
});