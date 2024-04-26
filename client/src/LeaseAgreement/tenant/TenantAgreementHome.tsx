import "TenantPOV/tenantapplication.css";
import PropertyCard, {
  PropertyCardProps,
} from "component/AgreementComponents/property-card";

const TenantAgreementHome = () => {
  const propertyActionListingInfo: PropertyCardProps[] = [
    {
      imageUrl: "Images/commercial2.jpg",
      title: "Tiara Damansara's Master Room Unit 315/3",
      locationOwner: "PETALING JAYA | CONDO by Ali bin Abu",
      bedroom: 1,
      bathroom: 2,
      sqft: "1250 Sqft",
      price: "RM 500",
      status: "viewLease",
    },
  ];

  const propertyOtherListingInfo: PropertyCardProps[] = [
    {
      imageUrl: "Images/propertyImg3.png",
      title: "Sekeyen 15, Unit 34",
      locationOwner: "Sekeyen 15, Unit 34",
      bedroom: 1,
      bathroom: 2,
      sqft: "1250 Sqft",
      price: "RM 500",
      status: "active",
    },
  ];

  return (
    <main>
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Lease Agreements</h1>
        <h2 className="applicationSubTitle">Action Needed</h2>
        {propertyActionListingInfo.map((property, index) => (
          <PropertyCard
            key={index}
            imageUrl={property.imageUrl}
            title={property.title}
            locationOwner={property.locationOwner}
            bedroom={property.bedroom}
            bathroom={property.bathroom}
            sqft={property.sqft}
            price={property.price}
            status={property.status}
          />
        ))}
        <h2 className="applicationSubTitle">Other Application/s</h2>
        {propertyOtherListingInfo.map((property, index) => (
          <PropertyCard
            key={index}
            imageUrl={property.imageUrl}
            title={property.title}
            locationOwner={property.locationOwner}
            bedroom={property.bedroom}
            bathroom={property.bathroom}
            sqft={property.sqft}
            price={property.price}
            status={property.status}
          />
        ))}
      </div>
    </main>
  );
};

export default TenantAgreementHome;
