import "bootstrap/dist/js/bootstrap.bundle";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navBar.css";

const NavBarDark = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const determineActiveItem = () => {
            const path = location.pathname;
            if (path.includes("registerRole")) {
                return "RegisterRole";
            } else if (path.includes("register")) {
                return "Register";
            } else if (path.includes("/login")) {
                return "Login";
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
        <div className="navbarContainer navbar-dark-custom" style={{ borderBottom: 'none' }}>
            <nav className="navbar navbar-expand-lg">
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
                        <span className="navbar-toggler-icon" style={{ backgroundImage: "url(/Images/menuWhite.png)" }}></span>
                    </button>
                    <Link to="/" className="navbar-logo-container text-decoration-none">
                        <img
                            src="/Images/logo.png"
                            alt="Logo"
                            width="45"
                            style={{ borderRadius: 10 }}
                        />
                        {!isMobile && <span className="nav-title" style={{ color: 'white' }}>Well<span class="font-medium">-Bot</span></span>}
                    </Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                        <ul className="navbar-nav">
                            <li className={`nav-item ${activeItem === "Login" ? "active" : ""}`}>
                                <Link className={isMobile ? "nav-link" : "nav-white-button"} to="/login" onClick={() => handleItemClick("Login")} disabled={activeItem === "Login"}>Login</Link>
                            </li>
                            <li className={`nav-item ${activeItem.includes("Register") ? "active" : ""}`}>
                                <Link className={isMobile ? "nav-link" : "nav-green-button"} to="/registerRole" onClick={() => handleItemClick("RegisterRole")} disabled={activeItem === "RegisterRole"}>Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBarDark;