import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './navbar.css';

const NavbarTenant = () => {
    const [activeItem, setActiveItem] = useState('Rent');

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    return(
        <div>   
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <img src="Images/logoText.png" alt="Logo" width='90' height='90'/>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className={`nav-item ${activeItem === 'Rent' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/" onClick={() => handleItemClick('Rent')}>Rent</Link>
                        </li>
                        <li className={`nav-item ${activeItem === 'Condo' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/condo" onClick={() => handleItemClick('Condo')}>Condo</Link>
                        </li>
                        <li className={`nav-item ${activeItem === 'Commercial' ? 'active' : ''}`}>
                            <Link className="nav-link" to="/commercial" onClick={() => handleItemClick('Commercial')}>Commercial</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
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