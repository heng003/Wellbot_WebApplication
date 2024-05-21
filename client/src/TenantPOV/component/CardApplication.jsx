import React from "react";
import { useNavigate } from "react-router-dom";
import "./cardHistory.css";
import "./cardApplication.css";
import bedroomIcon from "./Rental_Icon/bedroom.png";
import bathroomIcon from "./Rental_Icon/bathroom.png";
import sqftIcon from "./Rental_Icon/sqft.png";

const CardApplication = ({ listing }) => {
  const {
    title,
    locationOwner,
    imageUrl,
    isViewLease,
    isPending,
    isRejected,
    bedroom,
    bathroom,
    sqft,
    price,
  } = listing;

  const nav = useNavigate();

  const handleViewPropertyStatus = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isPending) {
      nav("/tenantViewPropertyPending");
    } else if (isRejected) {
      nav("/tenantViewPropertyRejected");
    } else if (isViewLease) {
      nav("/tenantViewPropertyLease");
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
              <img src={bedroomIcon} className="bedroomIcon" alt="Bedroom Icon" />
              <p className="icon-text">{bedroom}</p>
            </div>
            <div className="facilities-per-icon">
              <img src={bathroomIcon} className="bathroomIcon" alt="Bathroom Icon" />
              <p className="icon-text">{bathroom}</p>
            </div>
            <div className="facilities-per-icon">
              <img src={sqftIcon} className="sqftIcon" alt="Sqft Icon" />
              <p className="icon-text">{sqft}</p>
            </div>
          </div>
        </div>
        <div className="propertyStatusApplication">
          {isViewLease && (
            <button className="view-lease-btn" onClick={(e) => { e.stopPropagation(); nav("/tenantViewPropertyLease"); }}>
              View Lease
            </button>
          )}
          {isPending && <button className="pending-btn">Pending</button>}
          {isRejected && <button className="rejected-btn">Rejected</button>}
          <h2 className="propertyPriceApplication">{price}</h2>
        </div>
      </div>
    </div>
  );
};

export default CardApplication;