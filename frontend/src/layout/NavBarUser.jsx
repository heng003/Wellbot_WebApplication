import "bootstrap/dist/js/bootstrap.bundle";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navBar.css";

const NavBarUser = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const determineActiveItem = () => {
            const path = location.pathname;
            if (path.includes("access")) {
                return "Access";
            } else if (path.includes("/dashboard")) {
                return "Dashboard";
            } else if (path.includes("profile")) {
                return "Profile";
            } else {
                return "";
            }
        };

        setActiveItem(determineActiveItem());
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return (
        <div className="navbarContainer">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid" style={{ padding: "0 2.5em" }}>
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
                    <Link to="/" className="navbar-logo-container text-decoration-none">
                        <img
                            src="/Images/logo.png"
                            alt="Logo"
                            height="40"
                        />
                        {!isMobile && <span className="nav-title">Well-Bot</span>}
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className={`nav-item ${activeItem === "Dashboard" ? "active" : ""}`}>
                                <Link
                                    className="nav-link"
                                    to="/user/dashboard"
                                    onClick={() => handleItemClick("Dashboard")}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className={`nav-item ${activeItem === "Access" ? "active" : ""}`}>
                                <Link
                                    className="nav-link"
                                    to="/user/accessManage"
                                    onClick={() => handleItemClick("Access")}
                                >
                                    Access Management
                                </Link>
                            </li>

                            <li className={`nav-item ${activeItem === "Profile" ? "active" : ""}`}>
                                <Link
                                    className="nav-link"
                                    to="/user/profile"
                                    onClick={() => handleItemClick("Profile")}
                                >
                                    Profile
                                </Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className={isMobile ? "nav-link" : "nav-white-button"} onClick={() => localStorage.removeItem('token')} to="/">Log Out</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBarUser;