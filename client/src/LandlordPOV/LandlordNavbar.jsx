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
        case'/landlordHistory':
            setActiveItem('RentalHistory');
            break;
        case '/landlordProfileEdit':
            setActiveItem('Edit Profile');
            break;
        case '/landlordApplicant':
        case '/landlordApplicantFeedback':
        case '/landlordLeaseAgreementForm':
        case '/landlordLeaseAgreementPg1':
        case '/landlordLeaseAgreementPg2':
        case '/landlordLeaseAgreementPg3':
            setActiveItem('Applicant');
            break;
        default:
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
    console.log("Token before removal:", localStorage.getItem('token'));
    localStorage.removeItem('token');
    console.log("Token after removal:", localStorage.getItem('token'));
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
