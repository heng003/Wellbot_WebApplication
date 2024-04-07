import React from "react";
import '../css/navbar.css';


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
                            <a class="nav-link" href="#">Rent</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Condo</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Commercial</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Sign In</a>
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