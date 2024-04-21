import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import CardProperty from "../component/CardProperty";
import 'bootstrap/dist/js/bootstrap.bundle';

const Commercial = () => {

    const [selectedOption2, setSelectedOption2] = useState('');
    const [selectedOption3, setSelectedOption3] = useState('');
    const [isSearchClicked, setIsSearchClicked] = useState(false);

    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

    const locations = ["Petaling Jaya", "Cheras", "Kajang", "Ampang"];
    const priceRanges = ["RM500 - RM1000", "RM1000 - RM1500", "RM1500 - RM2000"];

    const dropdownRef2 = useRef(null);
    const dropdownRef3 = useRef(null);

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
                setIsLocationOpen(false);
            }
            if (dropdownRef3.current && !dropdownRef3.current.contains(event.target)) {
                setIsPriceRangeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchButtonClick = () => {
        setIsSearchClicked(true);
    };

    const selectOption = (option, setter, refSetter) => {
        setter(option);
        refSetter(false);
    };
    
    // Array of card data objects for frontend demo
    const cardData = [
        {
        imgSrc: "Images/commercial.jpg",
        cardTitle1: "RM 500 Per Month",
        cardTitle2: "Tiara Damansara's Master Room",
        cardText: "Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor",
        roomDetails: ["1", "2", "350sf"]
        },

        {
        imgSrc: "Images/commercial2.jpg",
        cardTitle1: "RM 500 Per Month",
        cardTitle2: "Tiara Damansara's Master Room",
        cardText: "Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor",
        roomDetails: ["1", "2", "350sf"]
        }
    ];

    return(
        <div className='generalContent'>
             <section id="filter">
                    <div className="container">
                        <header className="subTitle text-center fs-2 fw-bolder mt-4">
                            Find Your Dream Property
                        </header>
                        <div className="row row-cols-1 row-cols-md-2 g-5">
                            <div className="property-selector">
                                <label htmlFor="location" className="filterTitle">Location</label>
                                <div className="Specificform-select" tabIndex={0} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                                    <div className="displayed-value">{selectedOption2 || 'Please Select'}</div>
                                    {isLocationOpen && (
                                        <div className="custom-options" ref={dropdownRef2}>
                                            {locations.map((location, index) => (
                                                <div key={index}
                                                    className={`custom-option ${selectedOption2 === location ? 'selected' : ''}`}
                                                    onClick={() => selectOption(location, setSelectedOption2, setIsLocationOpen)}>
                                                    {location}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
    
                            <div className="property-selector">
                                <label htmlFor="priceRange" className="filterTitle">Price Range</label>
                                <div className="Specificform-select" tabIndex={0} onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
                                    <div className="displayed-value">{selectedOption3 || 'Please Select'}</div>
                                    {isPriceRangeOpen && (
                                        <div className="custom-options" ref={dropdownRef3}>
                                            {priceRanges.map((priceRange, index) => (
                                                <div key={index}
                                                    className={`custom-option ${selectedOption3 === priceRange ? 'selected' : ''}`}
                                                    onClick={() => selectOption(priceRange, setSelectedOption3, setIsPriceRangeOpen)}>
                                                    {priceRange}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className="searchButton" type="button" onClick={handleSearchButtonClick}>Search</button>
                    </div>
                </section>

            <section id="recommendation">
                <header className="recommendationTitle text-left fs-2 fw-bolder mt-4" style={{marginBottom:'0.4em'}}>
                    {isSearchClicked ? "Filter Result/s" : "Recommendations"}
                </header>
                <div className="row row-cols-1 row-cols-md-3 g-5">
                    {cardData.map((card, index) => (
                    <div key={index} className="col">
                        <CardProperty
                            imgSrc={card.imgSrc}
                            cardTitle={card.cardTitle1}
                            propertyTitle={card.cardTitle2}
                            propertyAdd={card.cardText}
                            roomDetails={card.roomDetails}
                        />
                    </div>
                    ))}
                </div>
                <br /><br /><br /><br /><br />
            </section>
        </div>
    );
}

export default Commercial;