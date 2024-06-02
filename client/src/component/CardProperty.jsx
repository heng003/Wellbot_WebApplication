import React from "react";
import '../GeneralPage/home.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useNavigate } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "../LandlordPOV/components/ui/3d-card";

const CardProperty = ({ propertyId, imgSrc, cardTitle, propertyTitle, propertyAdd, roomDetails }) => {
    const roomImgSrc = ["Images/bedroom.png", "Images/bathroom.png", "Images/sqrt.png"];

    const navigate = useNavigate();

    const handleViewProperty = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(`/tenantViewProperty/${propertyId}`);
    }

    return (
        <CardContainer className="card_Container">
            <CardBody className="relative group/card bg-white dark:bg-black dark:hover:shadow-2xl 
            dark:hover:shadow-emerald-500/[0.1] dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto 
            rounded-full p-6 border" onClick={handleViewProperty}>
            <CardItem onClick={handleViewProperty} translateZ="100">
                <img
                    src={imgSrc}
                    className="card-img-top"
                    alt="propertyImage"
                    style={{ height: "280px", width: "385px" }}
                />
                </CardItem>
                <CardItem onClick={handleViewProperty} translateZ="60" className="card-body d-flex flex-column justify-content-between">
                    <CardItem onClick={handleViewProperty} className="card-desription-container">
                        <h4 className="card-title1" style={{ paddingTop: "10px" }}>{cardTitle}</h4>
                        <h6 className="card-title2">{propertyTitle}</h6>
                        <p className="card-text">{propertyAdd}</p>
                    </CardItem>

                <ul className="roomIconsGroup">
                {roomDetails.map((detail, index) => (
                    <li key={index} className="roomDetailsOneIconGroup">
                    <img
                        src={roomImgSrc[index]}
                        alt="details"
                        width="35"
                        height="35"
                        style={{ marginRight: "0.5em" }}
                    />{" "}
                    {detail}
                    </li>
                ))}
                </ul>

                <CardItem onClick={handleViewProperty} className="viewButton" translateZ="60">
                    <button className="View-Button" type="button">View</button>
                    </CardItem>
                
                </CardItem>
            </CardBody>
        </CardContainer>
    )
}

export default CardProperty;