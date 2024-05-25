import React, {useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../LandlordPOV/landlordhome.css'
import '../GeneralPage/home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CardPropertyLandlord from "../component/CardPropertyLandlord";
import axios from 'axios';

const LandlordHome = () => {
  const [propertyList, setPropertyList] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [locations, setLocations] = useState(["All Location"]);
  const { landlordId } = useParams();

  const navigate = useNavigate();

  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  const properties = ["All Properties Type", "Condo", "Commercial", "Landed", "Room"];
  const priceRanges = ["All Price Range", "RM 500 Below", "RM 500 - RM 1000", "RM 1001 - RM 1500", "RM 1501 - RM 2000", "RM 2001 - RM 2500", "RM 2500 Above"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`/api/properties/${landlordId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched properties:', response.data);
        setPropertyList(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    if (landlordId) {
      fetchProperties();
    }
  }, [landlordId]);

  useEffect(() => {
    console.log('Updated propertyList:', propertyList);
    setPropertyToCardData();
  }, [propertyList]);

  const setPropertyToCardData = () => {
    const mappedCardData = propertyList.map(property => ({
      propertyId: property._id,
      imgSrc: property.coverPhoto,
      cardTitle1: `RM ${property.price} Per Month`,
      cardTitle2: property.name,
      cardText: property.address,
      roomDetails: [property.bedroom.toString(), property.bathroom.toString(), `${property.buildUpSize}sf`],
      propertyType: property.type,
      location: property.location,
      priceRange: determinePriceRange(property.price)
    }));
    console.log('Mapped card data:', mappedCardData);
    setCardData(mappedCardData);

    const uniqueLocations = [...new Set(propertyList.map(property => property.location))];
    setLocations(["All Location", ...uniqueLocations]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsPropertyTypeOpen(false);
      }
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

  const determinePriceRange = (price) => {
    if (price <= 500) {
      return "RM 500 Below";
    } else if (price <= 1000) {
      return "RM 500 - RM 1000";
    } else if (price <= 1500) {
      return "RM 1001 - RM 1500";
    } else if (price <= 2000) {
      return "RM 1501 - RM 2000";
    } else if (price <= 2500) {
      return "RM 2001 - RM 2500";
    } else {
      return "RM 2500 Above";
    }
  };

  const handleSearchButtonClick = () => {
    setIsSearchClicked(true);
    const results = cardData.filter((card) => {
      const matchesType =
        selectedOption1 === "All Properties Type" ||
        !selectedOption1 ||
        card.propertyType === selectedOption1;
      const matchesLocation =
        selectedOption2 === "All Location" ||
        !selectedOption2 ||
        card.location === selectedOption2;
      const matchesPriceRange =
        selectedOption3 === "All Price Range" ||
        !selectedOption3 ||
        card.priceRange === selectedOption3;
      return matchesType && matchesLocation && matchesPriceRange;
    });
    console.log('Filtered results:', results);
    setFilteredResults(results);
  };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

  return (
    <div>
      <main>
        <section id="landlordHome">
          <div className="container">
            <div className="row" id="landlordMain">
              <div className="col">
                <div className="container" id="homeTitle">
                  <div className="row">
                    <p className="display-4 fw-bolder mt-5">Find Your Uploaded Property<span id="text"> In Just A Moment</span></p>
                  </div>
                  <div className="row" id="filter_location">
                    <div className="col" id="state_search_find">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                        <div className="displayed-value">{selectedOption2 || 'All Location'}</div>
                        {isLocationOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef2}>
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
                      <br />
                    </div>
                    <div className="col" id="filter_residential">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}>
                        <div className="displayed-value">{selectedOption1 || 'All Properties Type'}</div>
                        {isPropertyTypeOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef1}>
                            {properties.map((property, index) => (
                              <div key={index}
                                className={`custom-option ${selectedOption1 === property ? 'selected' : ''}`}
                                onClick={() => selectOption(property, setSelectedOption1, setIsPropertyTypeOpen)}>
                                {property}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <br />
                    </div>
                    <div className="col" id="filter_pricerange">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
                        <div className="displayed-value">{selectedOption3 || 'All Price Range'}</div>
                        {isPriceRangeOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef3}>
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
                      <br />
                    </div>
                    <div className="col" id="state_search_btn">
                      <button className="btn btn-dark mt-3" type="button" id="search" onClick={handleSearchButtonClick}>Search</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" id="search_query">
                <div className="col">
                  <div className="input-group mt-3">
                    <input type="text" className="form-control" placeholder="Search Your Property Here..." value={searchQuery} onChange={handleSearchInputChange} />
                  </div>
                </div>
                <div className="col-1" id="search_btn">
                  <button className="btn btn-dark" type="button">Search</button>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              {isSearchClicked
                ? filteredResults.map((card, index) => (
                  <CardPropertyLandlord key={index} {...card} />
                ))
                : cardData.map((card, index) => (
                  <CardPropertyLandlord key={index} {...card} />
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandlordHome;