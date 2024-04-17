import React from "react";
import './tenantapplication.css';
import CardRent from "./component/CardRent";

const TenantApplication = () => {

    const propertyListingInfo = [
        {
            title: "Tiara Damansara’s Master Room Unit 315/3",
            locationOwner: "PETALING JAYA | CONDO by Ali bin Abu",
            duration: "7 January 2024 - 7 January 2025",
            imageUrl: "Images/commercial2.jpg",
            isActive: true
        },
        {
            title: "Sekeyen 15, Unit 34",
            locationOwner: "PETALING JAYA | Landed House by Rosli",
            duration: "2 February 2023 - 1 February 2024",
            imageUrl: "Images/propertyImg3.png",
            isActive: false
        }
    ];

    return (
        <main>
            <div className="pageMainContainer">
                <h1 className="pageMainTitle">Application History</h1>
                <h2 className="applicationSubTitle">Action Needed</h2>
                {
                    propertyListingInfo.map((listing, index) => (
                        <CardRent key={index} listing={listing} />
                    ))
                }
                <h2 className="application-subTitle">Other Application/s</h2>
            </div>
        </main>
    );

}

export default TenantApplication;