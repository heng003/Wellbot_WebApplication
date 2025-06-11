import React from "react";
import "../styles/landingPage.css";

const CardFeature = ({ cardIcon, cardTitle, cardContent }) => {
    return (
        <div className="feature-card">
            <img
                className="mb-3"
                src={`/Images/${cardIcon}`}
                alt={cardTitle}
                height="55"
                width="55"
            />
            <h3 className="landing-title-small">{cardTitle}</h3>
            <p className="landing-content-small">{cardContent}</p>
        </div>
    );
};

export default CardFeature;