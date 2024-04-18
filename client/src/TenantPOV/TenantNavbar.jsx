import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import '../GeneralPage/navbar.css';

const TenantNavbar = () => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('Property');

    // Set activeItem based on current path
    useEffect(() => {
        const path = location.pathname;
            if (path === '/tenantViewPropertyLease' || path === '/tenantViewPropertyPending' || path === '/tenantViewPropertyRejected') {
                setActiveItem('Property');
            } else if (path === '/tenantApplyForm'){
                setActiveItem('Application');
            }
        }, [location]);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return (
        <div className="navbarContainer">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <img src="Images/logoText.png" alt="Logo" width='90' height='90' style={{ marginLeft: '1.5em' }} />

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className={`nav-item ${activeItem === 'Property' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/tenantHome" onClick={() => handleItemClick('Property')}>Property</Link>
                            </li>
                            <li className={`nav-item ${activeItem === 'Application' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/tenantApplication" onClick={() => handleItemClick('Application')}>Application</Link>
                            </li>
                            <li className={`nav-item ${activeItem === 'Lease Agreement' ? 'active' : ''}`} >
                                <Link className="nav-link" to="#" onClick={() => handleItemClick('Lease Agreement')}>Lease Agreement</Link>
                            </li>
                            <li className={`nav-item ${activeItem === 'Rental History' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/tenantRent" onClick={() => handleItemClick('Rental History')}>Rental History</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/tenantProfileEdit">Edit Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/" style={{ marginRight: '1.9em' }}>Log Out</Link>
                            </li>

                        </ul>
                    </div>
                    <a href="/tenantProfileEdit" >
                        <img src="Images/tenantProfile.png" alt="Avatar" width="90" height="90" style={{ marginRight: '1.5em' }} />
                    </a>
                </div>
            </nav>
        </div>
    );
}

export default TenantNavbar;