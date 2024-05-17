const mongoose = require('mongoose');
const { Schema } = mongoose;

use('RentSpotter');

// Step 1: Define schemas for properties and applications
const applicationSchema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    applicationStatus: String
});

const tenantSchema = new Schema({
    name: String,
    rating: Number,
    leaseStatus: String
});

const propertySchema = new Schema({
    landlordId: { type: Schema.Types.ObjectId, ref: 'Landlord' },
    name: String,
    type: String,
    address: String,
    location: String,
    postcode: String,
    bedroom: Number,
    bathroom: Number,
    furnishing: String,
    parking: Number,
    floorLevel: Number,
    buildUpSize: Number,
    facilities: String,
    accessibility: String,
    price: Number,
    description: String,
    coverPhoto: String,
    photos: [String]
});

const Application = mongoose.model('Application', applicationSchema);
const Property = mongoose.model('Property', propertySchema);
const Tenant = mongoose.model('Tenant', tenantSchema);

// Step 2: Insert property documents into properties collection
const properties = [
    {
        landlordId: mongoose.Types.ObjectId('664675d28718fb6fe7c7251'),
        name: "Tiara Damandasara's Master Room (Unit 315/3)",
        type: "Room",
        address: "Tiara Damandasara, Unit 315/3, Kuala Lumpur",
        location: "Kuala Lumpur",
        postcode: "50480",
        bedroom: 1,
        bathroom: 1,
        furnishing: "Fully Furnished",
        parking: 1,
        floorLevel: 3,
        buildUpSize: 600,
        facilities: "Gym and Pool",
        accessibility: "Near Metro and Shopping Mall",
        price: 600,
        description: "A cozy master room in Tiara Damandasara.",
        coverPhoto: "https://example.com/photo1.jpg",
        photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
    },
    {
        landlordId: mongoose.Types.ObjectId('664675d28718fb6fe7c7251'),
        name: "Ryan and Miho Condominium (Unit 215/2)",
        type: "Condominium",
        address: "Ryan and Miho, Unit 215/2, Petaling Jaya, Selangor",
        location: "Petaling Jaya",
        postcode: "46350",
        bedroom: 3,
        bathroom: 2,
        furnishing: "Fully Furnished",
        parking: 2,
        floorLevel: 5,
        buildUpSize: 1500,
        facilities: "Gym and Pool",
        accessibility: "Near Metro and Shopping Mall",
        price: 2000,
        description: "A beautiful condominium with all amenities.",
        coverPhoto: "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/...",
        photos: ["https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2023/7/19/...", "https://example.com/photo4.jpg", "https://example.com/photo5.jpg"]
    },
    {
        landlordId: mongoose.Types.ObjectId('664675d28718fb6fe7c7251'),
        name: "Sekyen 17, Landed House",
        type: "Landed House",
        address: "Sekyen 17, Shah Alam, Selangor",
        location: "Shah Alam",
        postcode: "40150",
        bedroom: 4,
        bathroom: 3,
        furnishing: "Partially Furnished",
        parking: 3,
        floorLevel: 2,
        buildUpSize: 2000,
        facilities: "Garden",
        accessibility: "Near School and Shopping Mall",
        price: 3600,
        description: "A spacious landed house with a garden.",
        coverPhoto: "https://example.com/photo6.jpg",
        photos: ["https://example.com/photo6.jpg", "https://example.com/photo7.jpg"]
    }
];

const insertedProperties = await Property.insertMany(properties);

// Step 3: Insert tenant documents into tenants collection
const tenants = [
    {
        name: "Lye Xin Tian_1212",
        rating: 5,
        leaseStatus: "Under Review By Tenant"
    },
    {
        name: "RichealLim3@",
        rating: 4,
        leaseStatus: "Not Applicable"
    },
    {
        name: "John_812",
        rating: 3,
        leaseStatus: "Not Applicable"
    },
    {
        name: "MuhammadAli_0809",
        rating: 2,
        leaseStatus: "Signed"
    }
];

const insertedTenants = await Tenant.insertMany(tenants);

// Step 4: Insert application documents into applications collection
const applications = [
    {
        tenantId: insertedTenants[0]._id,
        propertyId: insertedProperties[0]._id,
        applicationStatus: "Pending"
    },
    {
        tenantId: insertedTenants[1]._id,
        propertyId: insertedProperties[0]._id,
        applicationStatus: "Pending"
    },
    {
        tenantId: insertedTenants[2]._id,
        propertyId: insertedProperties[1]._id,
        applicationStatus: "Approved"
    },
    {
        tenantId: insertedTenants[3]._id,
        propertyId: insertedProperties[1]._id,
        applicationStatus: "Rejected"
    }
];

await Application.insertMany(applications);

console.log('Data migrated successfully.');
