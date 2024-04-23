import React from "react";
import { useNavigate } from "react-router-dom";
import "TenantPOV/component/cardHistory.css";
import "TenantPOV/tenantapplication.css";
import "../../TenantPOV/component/cardApplication.css";

export interface PropertyCardProps {
  imageUrl: string;
  title: string;
  locationOwner: string;
  bedroom: number;
  bathroom: number;
  sqft: string;
  price: string;
  status: "viewLease" | "active";
}

const PropertyCard = ({
  imageUrl,
  title,
  locationOwner,
  bedroom,
  bathroom,
  sqft,
  price,
  status,
}: PropertyCardProps) => {
  const nav = useNavigate();

  const handleViewPropertyStatus = () => {
    if (status == "viewLease") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav("/tenantLeaseAgreementForm");
    } else if (status == "active") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav("/viewAgreement");
    }
  };

  return (
    <div className="applicationList_card" onClick={handleViewPropertyStatus}>
      <div className="history-listing">
        <div className="rentalHistory-image">
          <img src={imageUrl} alt="Rental Property" />
        </div>
        <div className="rentalHistory-details">
          <h2 className="rental_historyTitle">{title}</h2>
          <p className="descript_rental">{locationOwner}</p>

          <div className="facilities-icons">
            <div className="facilities-per-icon">
              <img
                src={"Images/bedroomGrey.png"}
                className="bedroomIcon"
                alt="Bedroom Icon"
              />
              <p className="icon-text">{bathroom}</p>
            </div>

            <div className="facilities-per-icon">
              <img
                src={"Images/bathroomGrey.png"}
                className="bathroomIcon"
                alt="Bathroom Icon"
              />
              <p className="icon-text">{bedroom}</p>
            </div>


            <div className="facilities-per-icon">
              <img src="Images/sqftGrey.png" className="sqftIcon" alt="Sqft Icon" />
              <p className="icon-text">{sqft}</p>
            </div>
          </div>
        </div>

        <div className="propertyStatusLease">
          {status == "viewLease" && (
            <button className="view-lease-btn">View Lease</button>
          )}
          {status == "active" && (
            <button className="pending-btn">Active</button>
          )}
          <h2 className="propertyPriceApplication">{price}</h2>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
