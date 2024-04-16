import React from "react";
import { Link } from 'react-router-dom';
import '../GeneralPage/navbar.css';

const LandlordNavbar = () => {

    return(
        <div className="navbarContainer">   
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <img src="Images/logoText.png" alt="Logo" width='90' height='90' style={{ marginLeft: '1.5em' }}/>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <Link className="nav-link" to="#">Your Property</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="#">Applicant</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="#">Lease Agreement</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="#">Rental History</Link>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                    <li class="nav-item">
                            <Link className="nav-link" to="/landlordProfileEdit">Edit Profile</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/" style={{ marginRight: '1.5em' }}>Log Out</Link>
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