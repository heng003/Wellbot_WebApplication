import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle";
import "./landlord_history.css";
import "./landlordapplicant.css";
import PropertySelector from '../component/PropertySelector';
import { getProperties } from '../services/api';
import downloadIcon from "./Rental_Icon/download.png";
import downloadHoverIcon from "./Rental_Icon/download_hover.png";
import starOnClick from "./Rental_Icon//rating_star_onClick.svg";
import starDefault from "./Rental_Icon/rating_star_default.svg";
import Alert from "../LandlordPOV/Alert";

function LandlordApplicant() {
  const [isOpenRating, setIsOpenRating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("Please Select Your Property");
  const [properties, setProperties] = useState([]);
  const [selectedRatingSort, setSelectedRatingSort] = useState("Highest to Lowest");
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRatingRef = useRef(null);

  const nav = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesData = await getProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const toggleRatingSort = () => {
    setSelectedRatingSort((prevSort) =>
      prevSort === "Highest to Lowest" ? "Lowest to Highest" : "Highest to Lowest"
    );
  };

  const handleAlert = () => {
    Alert();
  };

  const handleViewApplicantFeedback = (event) => {
    if (!event.target.classList.contains("signedStatusData") && !event.target.classList.contains("tenantReviewing")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav("/landlordApplicantFeedback");
    }
  };

  const handleDownloadSigned = (event) => {
    event.stopPropagation(); // Stop event propagation to prevent triggering handleViewApplicantFeedback
    const link = document.createElement("a");
    link.href = "https://drive.google.com/uc?export=download&id=17cF4WZw6zIB96n7WgmE2tN2_IxhFwvPp";
    link.download = "LeaseAgreement.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleAlert();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRatingRef.current && !dropdownRatingRef.current.contains(event.target)) {
        setIsOpenRating(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTable = (data) => (
    <table className="applicant-list-table">
      <thead>
        <tr>
          <th>Applicant's Username</th>
          <th>Rating</th>
          <th>Lease Agreement Status</th>
        </tr>
      </thead>
      <tbody onClick={handleViewApplicantFeedback}>
        {data.map((tenant, index) => (
          <tr key={tenant.name}>
            <td>{tenant.name}</td>
            <td>{renderRating(tenant.rating)}</td>
            <td>{renderStatus(tenant.leaseStatus)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRating = (rating) => (
    <div className="ratingStarsGroup">
      {Array.from({ length: rating }).map((_, i) => (
        <img
          key={i}
          src={starOnClick}
          alt="Rating Star"
          width="65"
          height="65"
          className="rating-star"
        />
      ))}
      {Array.from({ length: 5 - rating }).map((_, i) => (
        <img
          key={i}
          src={starDefault}
          alt="Rating Star"
          width="65"
          height="65"
          className="rating-star"
        />
      ))}
    </div>
  );

  const renderStatus = (status) => {
    if (status === "Signed") {
      return (
        <div
          className="signedStatusData"
          onClick={handleDownloadSigned}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span className="signedDownloadText">{status}</span>
          <img
            src={isHovering ? downloadHoverIcon : downloadIcon}
            className="signedDownloadIcon"
            alt="Download"
            width="28"
            height="28"
          />
        </div>
      );
    } else if (status === "Under Review By Tenant") {
      return <span className="tenantReviewing">{status}</span>;
    } else {
      return <span>{status}</span>;
    }
  };

  const sortTenantsByRating = (tenants, sortOption) => {
    return tenants.sort((a, b) => {
      if (sortOption === "Highest to Lowest") {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });
  };

  const renderTablesBasedOnSelection = () => {
    if (!selectedProperty || selectedProperty === "Please Select Your Property") {
      return (
        <>
          {properties.map((property, index) => (
            <React.Fragment key={index}>
              <h2 className="propertyName">{property.name}</h2>
              {renderTable(property.tenants)}
            </React.Fragment>
          ))}
        </>
      );
    } else {
      const selectedProp = properties.find(prop => prop.name === selectedProperty);
      if (selectedProp) {
        return (
          <>
            <h2 className="propertyName">{selectedProp.name}</h2>
            {renderTable(sortTenantsByRating(selectedProp.tenants, selectedRatingSort))}
          </>
        );
      } else {
        return (
          <h3 className="notHistory_Text">
            Sorry, this property hasn't been applied yet, so it <b>doesn't have any applicant's info</b>.
          </h3>
        );
      }
    }
  };

  return (
    <div className="rental-history">
      <h1 className="rentalTitle">Applicant</h1>
      <div className="property-selectors-group">
        <PropertySelector
          selectedProperty={selectedProperty}
          setSelectedProperty={setSelectedProperty}
        />
        <div className="property-selector" ref={dropdownRatingRef}>
          <label htmlFor="rating-sort">Sort by Rating</label>
          <div
            className="custom-select"
            tabIndex={0}
            onClick={() => setIsOpenRating(!isOpenRating)}
            onBlur={() => setIsOpenRating(false)}
          >
            <div className="displayed-value">{selectedRatingSort}</div>
            {isOpenRating && (
              <div className="custom-options">
                <div
                  className={`custom-option ${
                    selectedRatingSort === "Highest to Lowest" ? "selected" : ""
                  }`}
                  onClick={toggleRatingSort}
                >
                  Highest to Lowest
                </div>
                <div
                  className={`custom-option ${
                    selectedRatingSort === "Lowest to Highest" ? "selected" : ""
                  }`}
                  onClick={toggleRatingSort}
                >
                  Lowest to Highest
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="property-details">{renderTablesBasedOnSelection()}</div>
    </div>
  );
}

export default LandlordApplicant;