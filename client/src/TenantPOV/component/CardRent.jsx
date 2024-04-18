import React, { useState, useRef, useEffect } from 'react';
import './cardHistory.css';
import downLoad_Icon from '../component/Rental_Icon/download.png';
import downLoad_HoverIcon from '../component/Rental_Icon/download_hover.png';
import Comment_Icon from '../component/Rental_Icon/comment.png';
import Comment_Hover_Icon from '../component/Rental_Icon/comment_hover.png';
import Alert from '../../LandlordPOV/Alert';

const CardRent = ({ listing }) => {

    const { title, locationOwner, duration, isActive } = listing;
    const subtitle = isActive ? "Active" : "Expired";

    const [hoveredDownloadIcon, setHoveredDownloadIcon] = useState(false);
    const [hoveredCommentIcon, setHoveredCommentIcon] = useState(false);

    const handleDownloadIconMouseEnter = () => setHoveredDownloadIcon(true);
    const handleDownloadIconMouseLeave = () => setHoveredDownloadIcon(false);
    const handleCommentIconMouseEnter = () => setHoveredCommentIcon(true);
    const handleCommentIconMouseLeave = () => setHoveredCommentIcon(false);
    
    const handleAlert = () => {
        Alert();
    };

    const triggerDownload = () => {
        const link = document.createElement('a');
        link.href = 'https://drive.google.com/uc?export=download&id=17cF4WZw6zIB96n7WgmE2tN2_IxhFwvPp';
        link.download = 'LeaseAgreement.pdf';  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        {handleAlert()};
    };

    return (

        <div className={`rentalList_statusCard ${isActive ? 'active' : 'expired'}`}>

            <h2 className= "cardRental_subtitle">{subtitle}</h2>

            <div className="history-listing">

                <div className="rentalHistory-image">
                    <img src={listing.imageUrl} alt="Rental Property" />
                </div>

                <div className="rentalHistory-details">
                    <h2 className="rental_historyTitle">{title}</h2>
                    <p className="descript_rental">{locationOwner}</p>
                    <p className="descript_duration">Duration: {duration}</p>
                </div>

                <div className="property-actions">
                    {isActive ? (
                    <button className="view-agreement-btn">Active</button>
                    ) : (
                    <button className="expired-btn">Expired</button>
                    )}
                    
                </div>

                <div className="contact-icons">
                    <img 
                        className="rentalTenant-download"
                        src={hoveredDownloadIcon ? downLoad_HoverIcon : downLoad_Icon}
                        onMouseEnter={() => setHoveredDownloadIcon(true)}
                        onMouseLeave={() => setHoveredDownloadIcon(false)}
                        onClick={triggerDownload}   
                        alt="Download"
                    />

                    <a href="/tenantComment" className="rentalTenant-link">
                        <img 
                            className="rentalTenant-comment" 
                            src={hoveredCommentIcon ? Comment_Hover_Icon : Comment_Icon}
                            onMouseEnter={handleCommentIconMouseEnter}
                            onMouseLeave={handleCommentIconMouseLeave}
                            alt="Comment"
                        />
                    </a>
                </div>

            </div>
               
        </div>

    );
};

export default CardRent;