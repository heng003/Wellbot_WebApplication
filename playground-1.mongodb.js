
use('RentSpotter');

db.getCollection('leases').insertOne({
  tenantId: new ObjectId('663c7b00472233659b0e1a69'),
  propertyId: new ObjectId("664de2860b240b9d84eeffc8"),
  leaseStatus: "Effective",
  effectiveDateStart: ISODate("2024-01-15T00:00:00.000Z"),
  effectiveDateEnd: ISODate("2025-01-15T00:00:00.000Z"),
  PDF:null
});



db.getCollection('leases').insertOne({
  tenantId: new ObjectId('663c7b00472233659b0e1a69'),
  propertyId: new ObjectId("664ddfc3dc896d35b58501d3"),
  leaseStatus: "Expired",
  effectiveDateStart: ISODate("2024-02-01T00:00:00.000Z"),
  effectiveDateEnd: ISODate("2025-02-01T00:00:00.000Z"),
  PDF:null
});