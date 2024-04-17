import React from "react";
import './cardRent.css';
import downLoad_Icon from '../component/Rental_Icon/download.png';
import Comment_Icon from '../component/Rental_Icon/comment.png';

const CardRent = ({ listing }) => {
    const { title, locationOwner, duration, isActive } = listing;


    return (




        <div className="rentalList_card">






            <div className={`history-listing ${isActive ? 'active' : 'expired'}`}>


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
                    <img src={downLoad_Icon} alt="Download" />
                    <img src={Comment_Icon} alt="Message" />
                </div>


            </div>


        </div>
   
    );
};


export default CardRent;
