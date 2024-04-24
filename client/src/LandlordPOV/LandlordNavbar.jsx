import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../GeneralPage/navbar.css";

const LandlordNavbar = () => {

  const location = useLocation();
  const [activeItem, setActiveItem] = useState("YourProperty");

  useEffect(() => {
    switch (location.pathname) {
        case '/landlordHome':
        case '/landlordViewProperty':
        case '/landlordUpdateProperty':
        case '/landlordEditPhoto':
        case '/landlordUploadProperty':
        case '/landlordUploadPropertyPhoto':
        case '/landlordArrangePhoto':
            setActiveItem('YourProperty');
            break;
        case '/landlordComment':
        case'/landlordhistory':
            setActiveItem('RentalHistory');
            break;
        case '/landlordProfileEdit':
            setActiveItem('Edit Profile');
            break;
        case '/landlordApplicant':
        case '/landlordLeaseAgreementForm':
        case '/landlordLeaseAgreementPg1':
        case '/landlordLeaseAgreementPg2':
        case '/landlordLeaseAgreementPg3':
            setActiveItem('Applicant');
            break;
        default:
            setActiveItem('');
    }
}, [location]);
  
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  return (
    <div className="navbarContainer">
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <img
            src="Images/logoText.png"
            alt="Logo"
            width="90"
            height="90"
            style={{ marginLeft: "1.5em" }}
          />

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                className={`nav-item ${
                  activeItem === "YourProperty" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/landlordHome"
                  onClick={() => handleItemClick("YourProperty")}
                >
                  Your Property
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Applicant" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/landlordApplicant"
                  onClick={() => handleItemClick("Applicant")}
                >
                  Applicant
                </Link>
              </li>

              <li
                className={`nav-item ${
                  activeItem === "RentalHistory" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/landlordhistory"
                  onClick={() => handleItemClick("RentalHistory")}
                >
                  Rental History
                </Link>
              </li>
            </ul>
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link className="nav-link" to="/landlordProfileEdit">
                  Edit Profile
                </Link>
              </li>
              <li class="nav-item">
                <Link className="nav-link" to="/">
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
          <a href="#">
            <img
              src="Images/landlord_Profile.svg"
              alt="Avatar"
              width="110"
              height="auto"
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default LandlordNavbar;
