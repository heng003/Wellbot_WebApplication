import React from "react";
import '../GeneralPage/home.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useNavigate, useLocation } from "react-router-dom";

const CardProperty = ({ imgSrc, cardTitle, propertyTitle, propertyAdd, roomDetails }) => {
    const roomImgSrc = ["Images/bedroom.png", "Images/bathroom.png", "Images/sqrt.png"];

    const navigate = useNavigate();
    const location = useLocation();

    const handleViewProperty = () => {
        localStorage.setItem("previousPath", location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate("/tenantViewProperty"); 
    }

    return (
        <div className="card h-100" onClick={handleViewProperty}>
            <div>
                <img src={imgSrc} className="card-img-top" alt="propertyImage"/>
            </div>
            <div className="card-body d-flex flex-column justify-content-between">
                <div className="card-desription-container">
                    <h4 className="card-title1">{cardTitle}</h4>
                    <h6 className="card-title2">{propertyTitle}</h6>
                    <p className="card-text">{propertyAdd}</p>
                </div>

                <ul className="roomIconsGroup">
                    {roomDetails.map((detail, index) => (
                        <li key={index} className="roomDetailsOneIconGroup">
                            <img src={roomImgSrc[index]} alt="details" width="35" height="35" style={{ marginRight: '0.5em' }}/> {detail}
                        </li>
                    ))}
                </ul>

                <div className="viewButton">
                    <button className="View-Button" type="button" onClick={handleViewProperty}>View</button>
                </div>
            </div>
        </div>
    )
}

export default CardProperty;