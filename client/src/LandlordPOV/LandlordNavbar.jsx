import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../GeneralPage/navbar.css';

const LandlordNavbar = () => {

    const [activeItem, setActiveItem] = useState('YourProperty');

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return(
        <div className="navbarContainer">   
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <img src="Images/logoText.png" alt="Logo" width='90' height='90'/>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className={`nav-item ${activeItem === 'YourProperty' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/landlordHome" onClick={() => handleItemClick('YourProperty')}>Your Property</Link>
                        </li>
                        <li className={`nav-item ${activeItem === 'Applicant' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/landlordApplicantFeedback" onClick={() => handleItemClick('Applicant')}>Applicant</Link>
                        </li>
                        <li className={`nav-item ${activeItem === 'Lease Agreement' ? 'active' : ''}`}>
                            <Link className="nav-link" to="#" onClick={() => handleItemClick('Lease Agreement')}>Lease Agreement</Link>
                        </li> 

                        <li className={`nav-item ${activeItem === 'RentalHistory' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/landlordhistory" onClick={() => handleItemClick('RentalHistory')}>Rental History</Link>
                        </li>
                      
                    </ul>
                    <ul class="navbar-nav">
                    <li class="nav-item">
                            <Link className="nav-link" to="/landlordProfileEdit">Edit Profile</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/">Log Out</Link>
                        </li>
                    </ul>
                </div>
                <a href="#"><img src="Images/landlordProfile.png" alt="Avatar" width="90" height="90"/></a>
           </div>
           </nav>
        </div>
    );
}

export default LandlordNavbar;