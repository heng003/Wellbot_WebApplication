/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('RentSpotter');

// Insert a few documents into the sales collection.
db.getCollection('properties').insertOne({
  "landlordId": ObjectId('664675d28718fb6fe7e7c251'),
  "name": "Tiara Damansara Master Condominium",
  "type": "Condo",
  "address": "Tiara Damansara, Seksyen16, 46350 Petaling Jaya, Selangor",
  "location": "Petaling Jaya",
  "postcode": "46350",
  "bedroom": 3,
  "bathroom": 2,
  "furnishing": "Partially Furnished",
  "parking": 1,
  "floorLevel": 2,
  "buildUpSize": 2000,
  "facilities": "Gym and Pool",
  "accessibility": "Near Metro and Shopping Mall",
  "price": 1800,
  "description": "A beautiful apartment with all amenities.",
  "coverPhoto": "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/3/DOTY2023_Dramatic-Before-And-Afters_Hidden-Hills-11.jpg.rend.hgtvcom.1280.720.suffix/1689786863909.jpeg",
  "photos": [
      "https://rnb.scene7.com/is/image/roomandboard/homepageHero_freshFinds_1920?size=2400,2400&scl=1",
      "https://backyardpoolpatio.com/wp-content/uploads/2022/08/Leisure-Pools-Supreme-Graphite-Grey-leisure-pools-inside.webp.jpg",
      "https://st.hzcdn.com/simgs/pictures/bathrooms/2013-spring-parade-of-homes-highmark-builders-img~9c91268602011d2d_14-6822-1-7255a26.jpg"
  ]
});

db.getCollection('applications').insertOne({
  "tenantId": ObjectId('663c7b00472233659b0e1a69'),
  "propertyId": ObjectId('6647410873ae5b1e7c7123e2'),
  "applicationStatus": "Pending"
});