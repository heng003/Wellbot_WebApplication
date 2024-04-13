import React from "react";
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {

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
                        <Link className="nav-link" to="/">Rent</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" to="/condo">Condo</Link>
                        </li>
                        <li class="nav-item">
                        <Link className="nav-link" to="/commercial">Commercial</Link>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        <Link className="nav-link" to="/signIn">Sign In</Link>
                        </li>
                    </ul>
                </div>
                <a href="#"><img src="Images/profilepic.png" alt="Avatar" width="90" height="90"/></a>
           </div>
           </nav>
        </div>
    );
}

export default Navbar;