import React from "react";
import './detailspanel.css';

const DetailsPanel = () => {
    
    const propertyFacilitiesIcons = [
        "Images/propertyTypeIcon.png",
        "Images/sqrtIcon.png",
        "Images/bedroomIcon.png",
        "Images/bathroomIcon.png",
        "Images/carparkIcon.png",
        "Images/furnitureIcon.png"
    ];

    const propertyFacilities = [
        "High-Rise",
        "350 Sqft",
        "1 Bedroom",
        "2 Bathrooms",
        "None Carpark",
        "Fully-furnished"
    ];

    return (
        <section className="details-panel">
            <div className="heading">
                <h3 className="property-classfication">{`PROPERTY  |  PETALING JAYA | condo `}</h3>
            </div>

            <div className="rental-details">
                <div className="rent-price-unit-panel">
                    <div className="rent-breakdown">
                        <h2 className="rent-price">RM 500 Per Month</h2>
                        <h3 className="rent-unit">Rent one unit of Master room</h3>
                    </div>
                </div>

                <div className="property-details">
                    <div className="property-details-breakdown">
                        <h2 className="property-name">Tiara Damansara's Master Room Unit 315/3</h2>
                        <h3 className="property-address">Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor</h3>
                        
                        <div className="property-facilities">
                            <div className="property-facilities-breakdown">
                                <div className="specs-grid">
                                    {propertyFacilitiesIcons.map((icon, index) => (
                                        <div key={index} className={`specs-row-one${index + 1}`}>
                                            <div className="icon-wrapper">
                                                <img className="icon" src={icon}/>
                                            </div>
                                            <div className='facility-text'>
                                                {propertyFacilities[index]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <img
                            className="separator-icon"
                            loading="lazy"
                            alt=""
                            src="/line-3.svg"
                        />

                        <div className="property-description">
                            <div className="description-panel">
                                <h2 className="description">Description</h2>
                                <h3 className="lets-grab-this">
                                    Let’s grab this opportunity to have this cheap and nice room !
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="amenities">
                    <div className="facilities-parent">
                        <div className="facilities">
                            <h2 className="facilities1">Facilities</h2>
                            <h3 className="security-24-hr">
                                Security 24 Hr, Swimming, BBQ Area, Gym
                            </h3>
                        </div>
                        <div className="accessibility">
                            <h2 className="accessibility1">Accessibility</h2>
                            <h3 className="t815-bus-stop-container">
                                <p className="t815-bus-stop">T815 Bus Stop - 200m</p>
                                <p className="seventeen-mall-">Seventeen Mall - 600 m</p>
                                <p className="mrt-tiara-damansara">
                                    MRT Tiara Damansara - 800m
                                </p>
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="status-panel">
                    <div className="status-panel-child" />
                    <h2 className="pending-for-action">
                        PENDING FOR ACTION FROM LANDLORD
                    </h2>
                </div>
            </div>
        </section>
    );
}

export default DetailsPanel;