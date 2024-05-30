use("RentSpotter");

db.getCollection('leases').insertOne({
  tenantId: new ObjectId('663c7b00472233659b0e1a69'),
  propertyId: new ObjectId("6657d4d5f936915ae82f13e0"),
  leaseStatus: "Effective",
  effectiveDateStart: ISODate("2024-01-15T00:00:00.000Z"),
  effectiveDateEnd: ISODate("2025-01-15T00:00:00.000Z"),
  PDF:null
});



db.getCollection('leases').insertOne({
  tenantId: new ObjectId('663c7b00472233659b0e1a69'),
  propertyId: new ObjectId("6657d608f936915ae82f13f0"),
  leaseStatus: "Expired",
  effectiveDateStart: ISODate("2024-02-01T00:00:00.000Z"),
  effectiveDateEnd: ISODate("2025-02-01T00:00:00.000Z"),
  PDF:null
});