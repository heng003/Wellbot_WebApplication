
use('RentSpotter');

db.getCollection('applications').insertOne({
  tenantId: new ObjectId('664efa491ff11b5274cfe440'),
  propertyId: new ObjectId("664770d50a1b773d78a1f9b7"),
  applicationStatus: "Pending",
  __v : 0
});
