import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import CardGeneral from "../component/CardGeneral";
import 'bootstrap/dist/js/bootstrap.bundle';

const Commercial = () => {
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const locations = [
    "All Location",
    "Petaling Jaya",
    "Cheras",
    "Kajang",
    "Ampang",
    "Bandar Sri Damansara",
    "Bukit Bintang",
    "Bandar Sunway",
  ];
  const priceRanges = [
    "All Price Range",
    "RM 500 Below",
    "RM 500 - RM 1000",
    "RM 1001 - RM 1500",
    "RM 1501 - RM 2000",
    "RM 2001 - RM 2500",
    "RM 2500 Above",
  ];

  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsLocationOpen(false);
      }
      if (
        dropdownRef3.current &&
        !dropdownRef3.current.contains(event.target)
      ) {
        setIsPriceRangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchButtonClick = () => {
    setIsSearchClicked(true);
    const results = cardData.filter((card) => {
      const matchesLocation =
        selectedOption2 === "All Location" ||
        !selectedOption2 ||
        card.location === selectedOption2;
      const matchesPriceRange =
        selectedOption3 === "All Price Range" ||
        !selectedOption3 ||
        card.priceRange === selectedOption3;
      return matchesLocation && matchesPriceRange;
    });
    setFilteredResults(results);
  };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

  // Array of card data objects for frontend demo
  const cardData = [
    {
      imgSrc: "Images/commercial.jpg",
      cardTitle1: "RM 1500 Per Month",
      cardTitle2: "8 Trium (Office)",
      cardText:
        "Jalan Cempaka SD 12/5, Bandar Sri Damansgit ara, 52200 Kuala Lumpur",
      roomDetails: ["0", "3", "1000sf"],
      propertyType: "Commercial",
      location: "Bandar Sri Damansara",
      priceRange: "RM 1001 - RM 1500",
    },

    {
      imgSrc: "Images/commercial2.jpg",
      cardTitle1: "RM 1800 Per Month",
      cardTitle2: "Menara Yayasan Tun Razak",
      cardText: "Jalan Bukit Bintang, Bukit Bintang, KL City, Kuala Lumpur",
      roomDetails: ["7", "4", "1200sf"],
      propertyType: "Commercial",
      location: "Bukit Bintang",
      priceRange: "RM 1501 - RM 2000",
    },
  ];

  return (
    <div className="generalContent">
      <section id="filter">
        <div className="container">
          <header className="subTitle text-center fs-2 fw-bolder mt-4">
            Find Your Dream Property
          </header>
          <div className="row row-cols-1 row-cols-md-2 g-5">
            <div className="property-selector">
              <label htmlFor="location" className="filterTitle">
                Location
              </label>
              <div
                className="Specificform-select"
                tabIndex={0}
                onClick={() => setIsLocationOpen(!isLocationOpen)}
              >
                <div className="displayed-value">
                  {selectedOption2 || "Please Select"}
                </div>
                {isLocationOpen && (
                  <div className="custom-options" ref={dropdownRef2}>
                    {locations.map((location, index) => (
                      <div
                        key={index}
                        className={`custom-option ${
                          selectedOption2 === location ? "selected" : ""
                        }`}
                        onClick={() =>
                          selectOption(
                            location,
                            setSelectedOption2,
                            setIsLocationOpen
                          )
                        }
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="property-selector">
              <label htmlFor="priceRange" className="filterTitle">
                Price Range
              </label>
              <div
                className="Specificform-select"
                tabIndex={0}
                onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
              >
                <div className="displayed-value">
                  {selectedOption3 || "Please Select"}
                </div>
                {isPriceRangeOpen && (
                  <div className="custom-options" ref={dropdownRef3}>
                    {priceRanges.map((priceRange, index) => (
                      <div
                        key={index}
                        className={`custom-option ${
                          selectedOption3 === priceRange ? "selected" : ""
                        }`}
                        onClick={() =>
                          selectOption(
                            priceRange,
                            setSelectedOption3,
                            setIsPriceRangeOpen
                          )
                        }
                      >
                        {priceRange}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className="searchButton"
            type="button"
            onClick={handleSearchButtonClick}
          >
            Search
          </button>
        </div>
      </section>

            <section id="recommendation">
                <header className="recommendationTitle text-left fs-2 fw-bolder mt-4" style={{marginBottom:'0.4em'}}>
                    {isSearchClicked ? "Filter Result/s" : "Recommendations"}
                </header>
                <div className="row row-cols-1 row-cols-md-3 g-5">
                {(isSearchClicked ? filteredResults : cardData).map((card, index) => (  
                    <div key={index} className="col">
                        <CardGeneral
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
