use("RentSpotter");

db.getCollection("reviewlandlords").insertOne({
  landlordId: new ObjectId("664675d28718fb6fe7e7c251"),
  tenantId: new ObjectId("663c7b00472233659b0e1a69"),
  landlordRating: 4,
  commentLandlord:
    "Exceptional landlord! Always responsive to maintenance requests, kept the property well-maintained, and communicated effectively. Demonstrated professionalism and respect. I highly recommend this landlord.",
  commentDate: new Date(Date.now()),
});
