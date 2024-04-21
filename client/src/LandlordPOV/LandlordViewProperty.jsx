import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './landlordviewproperty.css';
import DetailsPanel from "./component/DetailsPanel";
import Swal from 'sweetalert2';

const ViewProperty = () => {
    
    const propertyImageSrc = [
        "Images/propertyImg3.png",
        "Images/propertyImg4.png",
        "Images/propertyImg2.png",
        "Images/propertyImg5.png"
    ];

    const nav = useNavigate();
    const location = useLocation();

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex(prevIndex => {
            let newIndex = prevIndex - 2;
            if (newIndex < 0) {
                newIndex = propertyImageSrc.length + newIndex;
            }
            return newIndex;
        });
    };
    
    const handleNext = () => {
        setCurrentIndex(prevIndex => {
            let newIndex = prevIndex + 2;
            if (newIndex >= propertyImageSrc.length) {
                newIndex = newIndex - propertyImageSrc.length;
            }
            return newIndex;
        });
    };
    
    return (
        <div>
            <main>
                <section id="PropertyImage">
                <div className="container">
                    <div className="imageContainer">
                            <img src={propertyImageSrc[currentIndex]} alt='propertyImages' className='propertyImage'/>
                            <img src={propertyImageSrc[(currentIndex + 1) % propertyImageSrc.length]} alt='propertyImages' className='propertyImage' id='propertyImage2'/>
                        </div>
                        <div className="buttonContainer">
                            <button className="previousButton" onClick={handlePrevious}>
                                <svg width="46" height="44" viewBox="0 0 46 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="23" cy="22" rx="23" ry="22" fill="#D9D9D9" fillOpacity="0.66"/>
                                    <path d="M14 21.5L25.3514 11L28 13.45L19.2973 21.5L28 29.55L25.3514 32L14 21.5Z" fill="#171616" fillOpacity="0.58"/>
                                </svg>
                            </button>
                            <button className="nextButton" onClick={handleNext}>
                                <svg width="46" height="44" viewBox="0 0 46 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="23" cy="22" rx="23" ry="22" fill="#D9D9D9" fillOpacity="0.66"/>
                                    <path d="M30 21.5L18.6486 32L16 29.55L24.7027 21.5L16 13.45L18.6486 11L30 21.5Z" fill="#171616" fillOpacity="0.58"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <section id="PropertyDetails">
                    <div className="container"><DetailsPanel/></div>
                </section>

            </main>
        </div>
    );
}

export default ViewProperty;