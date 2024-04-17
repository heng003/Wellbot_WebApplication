import React from "react";
import './tenantapplication.css';
import CardApplication from "./component/CardApplication";

const TenantApplication = () => {
    const propertyActionListingInfo = [
        {
            title: "Tiara Damansara's Master Room Unit 315/3",
            locationOwner: "PETALING JAYA | CONDO by Ali bin Abu",
            imageUrl: "Images/commercial2.jpg",
            isViewLease: true,
            isPending: false,
            isRejected: false,
            bedroom: 1,
            bathroom: 2,
            sqft: "1250 Sqft",
            price: "RM 500"
        }
    ];

    const propertyOtherListingInfo = [
        {
            title: "Sekeyen 15, Unit 34",
            locationOwner: "PETALING JAYA | Landed House by Rosli",
            imageUrl: "Images/propertyImg3.png",
            isViewLease: false,
            isPending: true,
            isRejected: false,
            bedroom: 1,
            bathroom: 2,
            sqft: "1250 Sqft",
            price: "RM 500"
        }, 
        {
            title: "Sekeyen 17, Unit 775",
            locationOwner: "PETALING JAYA | Landed House by Rosli",
            imageUrl: "Images/condo2.jpg",
            isViewLease: false,
            isPending: false,
            isRejected: true,
            bedroom: 1,
            bathroom: 2,
            sqft: "1250 Sqft",
            price: "RM 500"
        }
    ];

    return (
        <main>
            <div className="pageMainContainer">
                <h1 className="pageMainTitle">Application History</h1>
                <h2 className="applicationSubTitle">Action Needed</h2>
                {
                    propertyActionListingInfo.map((listing, index) => (
                        <CardApplication key={index} listing={listing} />
                    ))
                }
                <h2 className="applicationSubTitle">Other Application/s</h2>
                {
                    propertyOtherListingInfo.map((listing, index) => (
                        <CardApplication key={index} listing={listing} />
                    ))
                }
            </div>
        </main>
    );
}

export default TenantApplication;