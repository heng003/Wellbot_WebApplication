import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './cardHistory.css';
import downLoad_Icon from '../component/Rental_Icon/download.png';
import downLoad_HoverIcon from '../component/Rental_Icon/download_hover.png';
import Comment_Icon from '../component/Rental_Icon/comment.png';
import Comment_Hover_Icon from '../component/Rental_Icon/comment_hover.png';
import Alert from '../../LandlordPOV/Alert';

const CardRent = ({ listing }) => {

    const { property, leaseStatus, effectiveDateStart, effectiveDateEnd } = listing;
    const { name, type, location, landlordUsername, coverPhoto } = property;
    const isActive = leaseStatus === 'Active';
    const navigate = useNavigate();

    const [hoveredDownloadIcon, setHoveredDownloadIcon] = useState(false);
    const [hoveredCommentIcon, setHoveredCommentIcon] = useState(false);

    const handleDownloadIconMouseEnter = () => setHoveredDownloadIcon(true);
    const handleDownloadIconMouseLeave = () => setHoveredDownloadIcon(false);
    const handleCommentIconMouseEnter = () => setHoveredCommentIcon(true);
    const handleCommentIconMouseLeave = () => setHoveredCommentIcon(false);

    const handleCardClick = () => {
        if (isActive) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate(`/tenantViewPropertyActive/${property._id}`);  
        } else {
            navigate(`/tenantViewProperty/${property._id}`);
        }
    };

    const triggerDownload = (event) => {
        event.stopPropagation(); 
        const link = document.createElement('a');
        link.href = 'https://drive.google.com/uc?export=download&id=17cF4WZw6zIB96n7WgmE2tN2_IxhFwvPp';
        link.download = 'LeaseAgreement.pdf';  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString)).replace(/\//g, '/');
    };

    const handleCommentClick = (event) => {
        event.stopPropagation();
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate(`/tenantComment/${landlordUsername}`);
    };

    return (
        <div className={`rentalList_statusCard ${isActive ? 'active' : 'expired'}`} onClick={handleCardClick}>
            <div className="history-listing">
                <div className="rentalHistory-image">
                    <img src={coverPhoto} alt="Rental Property" />
                </div>
                <div className="rentalHistory-details">
                    <h2 className="rental_historyTitle">{name}</h2>
                    <p className="descript_rental">{location} | {type} rented out by {landlordUsername}</p>
                    <p className="descript_duration">Duration: {formatDate(effectiveDateStart)} - {formatDate(effectiveDateEnd)}</p>
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
                        onMouseEnter={handleDownloadIconMouseEnter}
                        onMouseLeave={handleDownloadIconMouseLeave}
                        onClick={triggerDownload}
                        alt="Download"
                    />
                    <div
                        className="rentalTenant-link"
                        onClick={handleCommentClick}
                    >
                        <img
                            className="rentalTenant-comment"
                            src={hoveredCommentIcon ? Comment_Hover_Icon : Comment_Icon}
                            onMouseEnter={handleCommentIconMouseEnter}
                            onMouseLeave={handleCommentIconMouseLeave}
                            alt="Comment"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardRent;