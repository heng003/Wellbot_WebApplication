import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../GeneralPage/navbar.css';

const TenantNavbar = () => {

    const [activeItem, setActiveItem] = useState('Property');

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return(
        <div className="navBarContainer">   
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <img src="Images/logoText.png" alt="Logo" width='90' height='90' style={{ marginLeft: '1.5em' }}/>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
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
                            <Link className="nav-link" to="#" onClick={() => handleItemClick('Rental History')}>Rental History</Link>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link className="nav-link" to="/tenantProfileEdit">Edit Profile</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/" style={{ marginRight: '1.9em' }}>Log Out</Link>
                        </li>
                        
                    </ul>
                </div>
                <a href="/tenantProfileEdit" >
                    <img src="Images/tenantProfile.png" alt="Avatar" width="45" style={{ marginRight: '1.5em' }}/>
                </a>
           </div>
           </nav>
        </div>
    );
}

export default TenantNavbar;