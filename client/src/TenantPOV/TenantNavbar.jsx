import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../GeneralPage/navbar.css";

const TenantNavbar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Property");

    useEffect(() => {
        switch (location.pathname) {
            case '/tenantHome':
            case '/tenantViewProperty':
                setActiveItem('Property');
                break;
            case '/tenantApplication':
            case '/tenantViewPropertyLease':
            case '/tenantViewPropertyPending':
            case '/tenantViewPropertyRejected':
            case '/tenantApplyForm':
                setActiveItem('Application');
                break;
            case '/tenantRent':
            case '/tenantComment':
            case'/tenantViewPropertyActive':
                setActiveItem('Rental History');
                break;
            case '/tenantProfileEdit':
                setActiveItem('Edit Profile');
                break;
            case '/tenantLeaseAgreementHome':
            case '/tenantLeaseAgreementForm':
            case '/tenantLeaseAgreementPg1':
            case '/tenantLeaseAgreementPg2':
            case '/tenantLeaseAgreementPg3':
            case '/tenantLeaseAgreementLastPg':
                setActiveItem('Lease Agreement');
                break;
            case '/tenantProfileEdit':
                setActiveItem('Edit Profile');
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <img
            src="Images/logoText.png"
            alt="Logo"
            width="90"
            height="90"
            style={{ marginLeft: "1.5em" }}
          />

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                className={`nav-item ${
                  activeItem === "Property" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantHome"
                  onClick={() => handleItemClick("Property")}
                >
                  Property
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Application" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantApplication"
                  onClick={() => handleItemClick("Application")}
                >
                  Application
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Lease Agreement" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantLeaseAgreementHome"
                  onClick={() => handleItemClick("Lease Agreement")}
                >
                  Lease Agreement
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Rental History" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantRent"
                  onClick={() => handleItemClick("Rental History")}
                >
                  Rental History
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li 
                className={`nav-item ${
                    activeItem === "Edit Profile" ? "active" : ""
                }`}>
                <Link 
                  className="nav-link"
                  to="/tenantProfileEdit" 
                  onClick={() => handleItemClick("Edit Profile")}>
                  Edit Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{ marginRight: "1.9em" }}
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
          <a href="/tenantProfileEdit">
            <img
              src="Images/tenant_Profile.svg"
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

export default TenantNavbar;
