import React from "react";
import { useNavigate } from "react-router-dom";
import "./cardHistory.css";
import "./cardApplication.css";
import bedroomIcon from "./Rental_Icon/bedroom.png";
import bathroomIcon from "./Rental_Icon/bathroom.png";
import sqftIcon from "./Rental_Icon/sqft.png";

const CardApplication = ({ listing }) => {
  const {
    propertyId,
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

  const handleViewLease = () => {};

<<<<<<< HEAD
  const handleViewLease = () => {};

=======
>>>>>>> c2e3d30 (comment part in the view property havent done)
  const handleViewPropertyStatus = () => {
    if (isPending) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav(`/tenantViewPropertyPending/${propertyId}`);
    } else if (isRejected) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav(`/tenantViewPropertyRejected/${propertyId}`);
    } else if (isViewLease) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav(`/tenantViewPropertyLease/${propertyId}`);
    }
  };

  // Check if any property data is missing
<<<<<<< HEAD
  if (
    !title ||
    !locationOwner ||
    !imageUrl ||
    !bedroom ||
    !bathroom ||
    !sqft ||
    !price
  ) {
=======
  if (!title || !locationOwner || !imageUrl || !bedroom || !bathroom || !sqft || !price) {
>>>>>>> c2e3d30 (comment part in the view property havent done)
    alert("Error: Missing property data!");
  }

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
                src={bedroomIcon}
                className="bedroomIcon"
                alt="Bedroom Icon"
              />
              <p className="icon-text">{bedroom}</p>
            </div>

            <div className="facilities-per-icon">
              <img
                src={bathroomIcon}
                className="bathroomIcon"
                alt="Bedroom Icon"
              />
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
            <button className="view-lease-btn" onClick={handleViewLease}>
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
