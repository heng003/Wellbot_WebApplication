import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle";
import "../styles/sidebar.css";

const Sidebar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith("/guardian")) {
            if (path.includes("monitoredUser")) setActiveItem("Management");
            else if (path.includes("analytics")) setActiveItem("Analytics");
            else if (path.includes("profile")) setActiveItem("Profile");
            else setActiveItem("");
        } else if (path.startsWith("/user")) {
            if (path.includes("dashboard")) setActiveItem("Dashboard");
            else if (path.includes("accessManage")) setActiveItem("Access");
            else if (path.includes("profile")) setActiveItem("Profile");
            else setActiveItem("");
        }
    }, [location]);

    const isGuardian = location.pathname.startsWith("/guardian");
    const isUser = location.pathname.startsWith("/user");

    // hide the sidebar on small screens (mobile) — the existing navbars use a collapse
    // if (isMobile) return null;

    return (
        <div className="app-with-sidebar">
            <aside className="wb-sidebar">
                <div className="wb-sidebar-header">
                    <Link to={isGuardian ? "/guardian/monitoredUser" : "/"} className="sidebar-logo">
                        <img src="/Images/logo.png" alt="logo" width="40" />
                        <span className="sidebar-title">Well-Bot</span>
                    </Link>
                </div>

                <nav className="wb-sidebar-nav">
                    {isGuardian && (
                        <ul>
                            <li className={activeItem === "Management" ? "active" : ""}>
                                <Link to="/guardian/monitoredUser">User Management</Link>
                            </li>
                            <li className={activeItem === "Analytics" ? "active" : ""}>
                                <Link to="/">Analytics</Link>
                            </li>
                            <li className={activeItem === "Profile" ? "active" : ""}>
                                <Link to="/guardian/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={() => localStorage.removeItem("token")}>Log Out</Link>
                            </li>
                        </ul>
                    )}

                    {isUser && (
                        <ul>
                            <li className={activeItem === "Dashboard" ? "active" : ""}>
                                <Link to="/user/dashboard">Dashboard</Link>
                            </li>
                            <li className={activeItem === "Access" ? "active" : ""}>
                                <Link to="/user/accessManage">Access Management</Link>
                            </li>
                            <li className={activeItem === "Profile" ? "active" : ""}>
                                <Link to="/user/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/" onClick={() => localStorage.removeItem("token")}>Log Out</Link>
                            </li>
                        </ul>
                    )}
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;
