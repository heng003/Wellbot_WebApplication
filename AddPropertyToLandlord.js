use('RentSpotter');

const landlord = db.users.findOne({ email: 'lyexintian@gmail.com' });

if (!landlord) {
  console.log('Landlord not found');
} else {

  const propertyDetails = [
    {
      name: "Tiara Damandasara's Master Room (Unit 315/3)",
      price: 600,
      type: "Room",
      tenants: [
        {
          name: "Lye Xin Tian_1212",
          rating: 5,
          LeaseStatus: "Under Review By Tenant" 
        },
        {
          name: "RichealLim3@",
          rating: 4,
          LeaseStatus: "Not Applicable"
        }
      ]
    },
    {
      name: "Ryan and Miho Condominium (Unit 215/2)",
      price: 2000,
      type: "Condominium",
      tenants: [
        {
          name: "John_812",
          rating: 3,
          LeaseStatus: "Signed"
        },
        {
          name: "MuhammadAli_0809",
          rating: 2,
          LeaseStatus: "Not Applicable"
        }
      ]
    },
    {
      name: "Sekyen 17, Landed House",
      price: 3600,
      type: "Landed House",
      tenants: []
    }
  ];

  db.users.updateOne(
    { email: 'lyexintian@gmail.com' },
    { $set: { properties: propertyDetails } }
  );

  const updatedLandlord = db.users.findOne({ email: 'lyexintian@gmail.com' });
  console.log('Updated landlord:', updatedLandlord);
}
