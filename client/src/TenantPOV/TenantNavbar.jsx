import React from "react";
import { Link } from 'react-router-dom';
import '../GeneralPage/navbar.css';

const TenantNavbar = () => {

    return(
        <div>   
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <img src="Images/logoText.png" alt="Logo" width='90' height='90'/>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <Link className="nav-link" to="/tenantHome">Property</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="#">Application</Link>
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
                            <Link className="nav-link" to="/tenantProfileEdit">Edit Profile</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/">Log Out</Link>
                        </li>
                        
                    </ul>
                </div>
                <a href="/tenantProfileEdit" >
                    <img src="Images/tenantProfile.png" alt="Avatar" width="90" height="90" />
                </a>
           </div>
           </nav>
        </div>
    );
}

export default TenantNavbar;