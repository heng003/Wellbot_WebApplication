import React from "react";
import '../GeneralPage/home.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useNavigate } from "react-router-dom";

const CardProperty = ({ imgSrc, cardTitle, propertyTitle, propertyAdd, roomDetails }) => {
    const roomImgSrc = ["Images/bedroom.png", "Images/bathroom.png", "Images/sqrt.png"];

    const navigate = useNavigate();

    const handleViewProperty = () => {
        navigate("/tenantViewProperty"); 
    }

    return (
        <div className="card h-100" onClick={handleViewProperty}>
            <img src={imgSrc} className="card-img-top" alt="propertyImage" />
            <div className="card-body">
                <h4 className="card-title1">{cardTitle}</h4>
                <h6 className="card-title2">{propertyTitle}</h6>
                <p className="card-text">{propertyAdd}</p>

                <ul className="room">
                    {roomDetails.map((detail, index) => (
                        <li key={index} className="roomDetails">
                            <img src={roomImgSrc} alt="details" width="35" height="35" /> {detail}
                        </li>
                    ))}
                </ul>

                <div className="viewButton">
                    <button className="searchButton" type="button" onClick={handleViewProperty}>View</button>
                </div>
            </div>
        </div>
    )
}

export default CardProperty;