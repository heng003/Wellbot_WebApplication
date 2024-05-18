import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../GeneralPage/navbar.css";

const LandlordNavbar = () => {

  const location = useLocation();
  const [activeItem, setActiveItem] = useState("YourProperty");
  const [isLogOut, setIsLogOut] = useState(false);
  const navigate = useNavigate();

  console.log('Current Path:', location.pathname); 
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/landlordHome') || path.startsWith('/landlordViewProperty') || path.startsWith('/landlordUpdateProperty') || path.startsWith('/landlordEditPhoto') || path.startsWith('/landlordUploadProperty') || path.startsWith('/landlordUploadPropertyPhoto') || path.startsWith('/landlordArrangePhoto')) {
      setActiveItem('YourProperty');
    } else if (path.startsWith('/landlordComment') || path.startsWith('/landlordHistory')) {
      setActiveItem('RentalHistory');
    } else if (path.startsWith('/landlordProfileEdit')) {
      setActiveItem('Edit Profile');
    } else if (path.startsWith('/landlordApplicant') || path.startsWith('/landlordApplicantFeedback') || path.startsWith('/landlordLeaseAgreementForm') || path.startsWith('/landlordLeaseAgreementPg1') || path.startsWith('/landlordLeaseAgreementPg2') || path.startsWith('/landlordLeaseAgreementPg3')) {
      setActiveItem('Applicant');
    } else {
      setActiveItem('');
    }
  }, [location.pathname]);
  
  useEffect(() => {
    if (isLogOut) {
      console.log("Navigating to home...");
      navigate('/');
    }
  }, [isLogOut, navigate]);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    setTimeout(() => {
      console.log("Username and token have been removed");
    }, 1000);

    setIsLogOut(true); // Set the logout flag to trigger redirection
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
              <li 
                className={`nav-item ${
                    activeItem === "Edit Profile" ? "active" : ""
                }`}>
                <Link 
                  className="nav-link"
                  to="/landlordProfileEdit" 
                  onClick={() => handleItemClick("Edit Profile")}>
                  Edit Profile
                </Link>
              </li>
              <li class="nav-item">
                <button className="nav-link" onClick={handleLogout}>Log Out</button>
              </li>
            </ul>
          </div>
          <a href="/landlordProfileEdit">
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
