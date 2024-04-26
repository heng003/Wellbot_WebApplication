import React, {useState, useEffect, useRef} from "react";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../LandlordPOV/landlordhome.css'
import '../GeneralPage/home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CardPropertyLandlord from "../component/CardPropertyLandlord";

const LandlordHome = () => {
  const [filterCriteria, setFilterCriteria] = useState({
    state: "",
    residential: "",
    priceRange: "",
  });
  const [filteredProperties, setFilteredProperties] = useState([]);

    const navigate = useNavigate();
    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    const [selectedOption3, setSelectedOption3] = useState("");
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
      
    const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);
      
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);
    const dropdownRef3 = useRef(null);
      
    const properties = ["All Properties Type","Condo", "Commercial", "Landed", "Room"];
    const locations = ["All Location","Petaling Jaya", "Cheras", "Kajang", "Ampang","Bandar Sri Damansara","Bukit Bintang","Bandar Sunway"];
    const priceRanges = ["All Price Range","RM 500 Below","RM 500 - RM 1000", "RM 1001 - RM 1500", "RM 1501 - RM 2000","RM 2001 - RM 2500","RM 2500 Above"];
    

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

  const isPriceInRange = (price, range) => {
    const [min, max] = range
      .split("-")
      .map((val) => parseInt(val.trim().replace("RM", "")));
    return price >= min && price <= max;
  };

  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
    setFilterCriteria({ ...filterCriteria, state: event.target.value });
  };
  const handleDropdownChange2 = (event) => {
    setSelectedOption2(event.target.value);
    setFilterCriteria({ ...filterCriteria, residential: event.target.value });
  };

  const handleDropdownChange3 = (event) => {
    setSelectedOption3(event.target.value);
    setFilterCriteria({ ...filterCriteria, priceRange: event.target.value });
  };

  const handleViewProperty = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/landlordViewProperty");
  };

  const handleUpdateProperty = (event) => {
    // Prevent the default behavior of the link
    event.preventDefault();
    // Stop event propagation to prevent triggering handleViewProperty
    event.stopPropagation();

    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/landlordUpdateProperty");
  };

    const handleSearchButtonClick = () => {
        setIsSearchClicked(true);
        const results = cardData.filter(card => {
            const matchesType = selectedOption1 === "All Properties Type" || !selectedOption1 || card.propertyType === selectedOption1;
            const matchesLocation = selectedOption2 === "All Location" || !selectedOption2 || card.location === selectedOption2;
            const matchesPriceRange = selectedOption3 === "All Price Range" || !selectedOption3 || card.priceRange === selectedOption3;
            const matchesSearchQuery = !searchQuery || card.cardTitle2.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesLocation && matchesPriceRange && matchesSearchQuery;
        });
        setFilteredProperties(results);
    };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

    // Array of card data objects for frontend demo
    const cardData = [
        {
        imgSrc: "Images/room.jpg",
        cardTitle1: "RM 500 Per Month",
        cardTitle2: "Tiara Damansara's Master Room",
        cardText: "Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor",  
        roomDetails: ["1", "2", "350sf"],
        propertyType: "Room", 
        location: "Petaling Jaya", 
        priceRange: "RM 500 - RM 1000"
        },

        {
        imgSrc: "Images/bungalow.jpg",
        cardTitle1: "RM 2500 Per Month",
        cardTitle2: "Sekysen 17 Landed House",
        cardText: "16, Jalan King 123/A, Seksyen 17, 46350 Petaling Jaya, Selangor", 
        roomDetails: ["7", "3", "2000sf"],
        propertyType: "Landed", 
        location: "Petaling Jaya", 
        priceRange: "RM 2001 - RM 2500"
        },
        
        {
        imgSrc: "Images/commercial.jpg",
        cardTitle1: "RM 1500 Per Month",
        cardTitle2: "8 Trium (Office)",
        cardText: "Jalan Cempaka SD 12/5, Bandar Sri Damansara, 52200 Kuala Lumpur", 
        roomDetails: ["0", "3", "1000sf"],
        propertyType: "Commercial", 
        location: "Bandar Sri Damansara", 
        priceRange: "RM 1001 - RM 1500"
        },

        {
        imgSrc: "Images/commercial2.jpg",
        cardTitle1: "RM 1800 Per Month",
        cardTitle2: "Menara Yayasan Tun Razak",
        cardText: "Jalan Bukit Bintang, Bukit Bintang, KL City, Kuala Lumpur",     
        roomDetails: ["7", "4", "1200sf"],
        propertyType: "Commercial", 
        location: "Bukit Bintang", 
        priceRange: "RM 1501 - RM 2000"
        },

        {
          imgSrc: "Images/condo_1.jpg",
          cardTitle1: "RM 2300 Per Month",
          cardTitle2: "Ryan & Miho",
          cardText: "Jln Profesor Diraja Ungku Aziz, Pjs 13, 46200 Petaling Jaya, Selangor",     
          roomDetails: ["4", "3", "1200sf"],
          propertyType: "Condo", 
          location: "Petaling Jaya", 
          priceRange: "RM 2001 - RM 2500"
          },


          {
            imgSrc: "Images/condo_2.jpg",
            cardTitle1: "RM 3500 Per Month",
            cardTitle2: "D' Latour",
            cardText: "Jalan Taylors Off Lebuhraya Damansara, Bandar Sunway, Subang Jaya, Selangor",  
            roomDetails: ["5", "3", "1800sf"],
            propertyType: "Condo", 
            location: "Bandar Sunway", 
            priceRange: "RM 2500 Above"
            }
    ];


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

    
  
    return(
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
                                    <br></br>
                                    
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
                                    <br></br>
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
                                    <br></br>
                                    </div>
                                </div>
                                        <div className="col-landlordhome" id="searchFilter">
                                            <div id="searchIcon">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                            <input type="search" name="searchProperty" id="searchProperty" placeholder="Search By Your Property Name" value={searchQuery} onChange={handleSearchInputChange} />
                                        </div>
                                        <br></br>
                                        <div className="col-landlordhome" id="find">
                                        <button id="findButton" type="button" onClick={handleSearchButtonClick}>Find</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </section>
        
                <section id="recommendation">
                    <header className="propertyTitle text-left fs-2 fw-bolder mt-4" style={{marginBottom:'0.4em'}}>
                    {filteredProperties.length > 0 ? 'Filter Result/s' : 'Your Properties'}
                    </header>
                    <div class="row row-cols-1 row-cols-md-3 g-5">
                    {(isSearchClicked ? filteredProperties : cardData).map((card, index) => (  
                        <div key={index} className="col">
                            <CardPropertyLandlord
                                imgSrc={card.imgSrc}
                                cardTitle={card.cardTitle1}
                                propertyTitle={card.cardTitle2}
                                propertyAdd={card.cardText}
                                roomDetails={card.roomDetails}
                            />
                        </div>
                        ))}
                        <div class="col" onClick={() => {
                            navigate('/landlordUploadProperty');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}>
                            <div class="card h-100">
                            <img src="Images/plus.png" class="card-img-top" alt="upload" height={295}/>
                            <div class="card-body">
                                <h4 class="card-title1">Upload Your Property Details <span id="hoverText">Now</span></h4>
                                <div className="uploadButton"> 
                                    <a href="#"><button id="upload" type="button">Upload</button></a>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        </section>
                        <br /><br /><br />

             </main>
        </div>
    );
};

export default LandlordHome;
