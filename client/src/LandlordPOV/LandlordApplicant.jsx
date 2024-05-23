import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle";
import "./landlord_history.css";
import "./landlordapplicant.css";
import downloadIcon from "./Rental_Icon/download.png";
import downloadHoverIcon from "./Rental_Icon/download_hover.png";
import starOnClick from "./Rental_Icon//rating_star_onClick.svg";
import starDefault from "./Rental_Icon/rating_star_default.svg";
import Alert from "../LandlordPOV/Alert";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function LandlordApplicant() {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRating, setIsOpenRating] = useState(false);
  const [selectedRatingSort, setSelectedRatingSort] = useState("Highest to Lowest");
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRatingRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nav = useNavigate();

  const handleSortOptionClick = (option) => {
    if (selectedRatingSort !== option) {
      setSelectedRatingSort(option);
    }
    setIsOpenRating(false);
  };

  const handleAlert = () => {
    Alert();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      async function fetchProperties() {
        try {
          const response = await axios.get(`/api/properties/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProperties(response.data);
        } catch (err) {
          console.error("Error fetching properties:", err);
          setError("Failed to fetch properties");
        }
      }
      fetchProperties();
    }
  }, []);

  useEffect(() => {
    async function fetchLeases() {
      if (selectedProperty && selectedProperty._id) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const applicationsResponse = await axios.get(`/api/applications/property/${selectedProperty._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const tenantIds = applicationsResponse.data.map(app => app.tenantId._id);
          const leasesResponse = await axios.get(`/api/applications/leases/tenants`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { tenantIds: tenantIds.join(',') }
          });

          const leasesData = leasesResponse.data;
          const combinedData = applicationsResponse.data.map(app => {
            const lease = leasesData.find(l => l.tenantId === app.tenantId._id);
            let leaseStatus = lease ? (lease.leaseStatus === 'Effective' ? 'Signed' : lease.leaseStatus) : 'Not Applicable';
            
           if (lease && lease.leaseStatus === 'Expired') {
              leaseStatus = 'Not Applicable';
            }

            return { ...app, leaseStatus, leaseId: lease ? lease._id : null };
          });

          setLeases(combinedData);
        } catch (err) {
          console.error("Error fetching leases:", err);
          setError("Failed to fetch leases");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLeases();
  }, [selectedProperty]);

  const handlePropertyChange = (propertyId) => {
    const selected = properties.find(property => property._id === propertyId);
    if (selected && (!selectedProperty || selected._id !== selectedProperty._id)) {
      setSelectedProperty(selected);
      setLeases([]);
    } else {
      setSelectedProperty(selected);
    }
  };

  const handleViewApplicantFeedback = (lease) => {
    console.log('Navigating to applicationReview with:', {
      username: lease.tenantId.username,
      leaseId: lease.leaseId
    });
    nav("/landlordApplicantFeedback", {
      state: { username: lease.tenantId.username, leaseId: lease.leaseId }
    });
  };

  const handleDownloadSigned = (event) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href =
      "https://drive.google.com/uc?export=download&id=17cF4WZw6zIB96n7WgmE2tN2_IxhFwvPp";
    link.download = "LeaseAgreement.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    {
      handleAlert();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      if (
        dropdownRatingRef.current &&
        !dropdownRatingRef.current.contains(event.target)
      ) {
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

      <tbody>
        {data.map((lease, index) => (
          <tr key={lease.id} onClick={() => handleViewApplicantFeedback(lease)}>
            <td>{lease.tenantId.username}</td>
            <td>{renderRatingOrCommentText(lease)}</td>
            <td>{renderStatus(lease.leaseStatus)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderRatingOrCommentText = (lease) => {
    const { tenantId } = lease;
    if (tenantId.overallRating === null) {
      return <span className="none_Rating">N/A</span>;
    } else {
      return renderRating(tenantId.overallRating);
    }
  };

  const renderRating = (rating) => {
    return (
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
  };

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
    return tenants.slice().sort((a, b) => {
      const ratingA = a.tenantId.overallRating ?? 0;
      const ratingB = b.tenantId.overallRating ?? 0;
      if (sortOption === "Highest to Lowest") {
        return ratingB - ratingA;
      } else {
        return ratingA - ratingB;
      }
    });
  };

  const renderTablesBasedOnSelection = () => {
    if (selectedProperty) {
      if (loading) {
        return <h3 className="Brief_Text">Loading...</h3>;
      }
      if (leases.length === 0) {
        return (
          <h3 className="Brief_Text">
            Sorry, this property hasn't been applied yet, so it{" "}
            <b>doesn't have any applicant's info</b>.
          </h3>
        );
      } else {
        const sortedLeases = sortTenantsByRating(leases, selectedRatingSort);
        return (
          <>
            <h2 className="propertyName">{selectedProperty.name}</h2>
            {renderTable(sortedLeases)}
          </>
        );
      }
    }
    return null;
  };

  return (
    <div className="rental-history">
      <h1 className="rentalTitle">Applicant</h1>
      <div className="property-selectors-group">
        <div className="property-selector" ref={dropdownRef}>
          <label htmlFor="property-select">Your Property</label>
          <div
            className="custom-select"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setIsOpen(false)}
          >
            <div className="displayed-value">
              {selectedProperty ? selectedProperty.name : "Please Select Your Property"}
            </div>
            {isOpen && (
              <div className="custom-options">
                {properties.map(property => (
                  <div
                    key={property._id}
                    className={`custom-option ${selectedProperty && selectedProperty._id === property._id ? "selected" : ""}`}
                    onClick={() => {
                      handlePropertyChange(property._id);
                      setIsOpen(false);
                    }}
                  >
                    {property.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                  className={`custom-option ${selectedRatingSort === "Highest to Lowest" ? "selected" : ""}`}
                  onClick={() => handleSortOptionClick("Highest to Lowest")}
                >
                  Highest to Lowest
                </div>
                <div
                  className={`custom-option ${selectedRatingSort === "Lowest to Highest" ? "selected" : ""}`}
                  onClick={() => handleSortOptionClick("Lowest to Highest")}
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