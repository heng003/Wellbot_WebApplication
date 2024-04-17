import React from "react";
import './cardRent.css';
import downLoad_Icon from '../component/Rental_Icon/download.png';
import Comment_Icon from '../component/Rental_Icon/comment.png';

const CardApplication = ({ listing }) => {

    return (

        <div className="applicationList_card">
            <div className={`history-listing ${isActive ? 'active' : 'expired'}`}>

                <div className="rentalHistory-image">
                    <img src={listing.imageUrl} alt="Rental Property" />
                </div>

                <div className="rentalHistory-details">
                    <h2 className="rental_historyTitle">{listing.title}</h2>
                    <p className="descript_rental">{listing.locationOwner}</p>
                </div>

                <div className="property-actions">
                    {isViewLease ? (
                        <button className="view-lease-btn">View Lease</button>
                    ) : isPending ? (
                        <button className="pending-btn">Pending</button>
                    ) : isRejected && (
                        <button className="rejected-btn">Rejected</button>
                    )}
                </div>

                <div className="contact-icons">
                    <img src={downLoad_Icon} alt="Download" />
                    <img src={Comment_Icon} alt="Message" />
                </div>

            </div>

        </div>
   
    );
};


export default CardApplication;