import React from "react";
import "bootstrap/dist/js/bootstrap.bundle";
import CardRent from "./component/cardRent";

const RentTenant = () => {
  const propertyListingInfo = [
    {
      title: "Tiara Damansara’s Master Room Unit 315/3",
      locationOwner: "PETALING JAYA | CONDO by Ali bin Abu",
      duration: "7 January 2024 - 7 January 2025",
      imageUrl: "Images/commercial2.jpg",
      isActive: true,
    },
    {
      title: "Sekeyen 15, Unit 34",
      locationOwner: "PETALING JAYA | Landed House by Rosli",
      duration: "2 February 2023 - 1 February 2024",
      imageUrl: "Images/propertyImg3.png",
      isActive: false,
    },
  ];

  return (
    <main>
      <div className="rental-history">
        <h1 className="rentalTitle">Rental History</h1>

        <div className="Rental-Card ">
          {propertyListingInfo.map((listing, index) => (
            <CardRent key={index} listing={listing} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default RentTenant;
