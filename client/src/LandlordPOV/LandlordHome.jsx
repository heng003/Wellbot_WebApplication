import React, {useState} from "react";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../LandlordPOV/landlordhome.css'
import '../GeneralPage/home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const LandlordHome = () => {

  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedOption3, setSelectedOption3] = useState("");

  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };
  const handleDropdownChange2 = (event) => {
    setSelectedOption2(event.target.value);
  };

  const handleDropdownChange3 = (event) => {
    setSelectedOption3(event.target.value);
  };
  
  
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
                                    <div className="row" id="state_search_find">
                                        <div className="col" id="stateFilter">
                                            <select
                                                className="form-select"
                                                id="stateType"
                                                value={selectedOption1}
                                                onChange={handleDropdownChange1}
                                            >
                                                <option value="" disabled hidden>All States</option>
                                                <option value="option1-1">Johor</option>
                                                <option value="option1-2">Kuala Lumpur</option>
                                                <option value="option1-3">Pulau Pinang</option>
                                                <option value="option1-4">Sabah</option>
                                                <option value="option1-5">Kelantan</option>
                                            </select>
                                        </div>
                                        <div className="col" id="searchFilter">
                                            <div id="searchIcon">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </div>
                                            <input type="search" name="searchProperty" id="searchProperty" placeholder="Search By Your Property Name"/>
                                        </div>
                                        <div className="col" id="find">
                                            <button id="findButton" type="button">Find</button>
                                        </div>
                                    </div>

                                    <div className="row" id="residential_price">
                                        <div className="col" id="residentialFilter">
                                            <select
                                                className="form-select"
                                                id="residential"
                                                value={selectedOption2}
                                                onChange={handleDropdownChange2}
                                            >
                                                <option value="" disabled hidden>All Residential</option>
                                                <option value="option2-1">Condominium</option>
                                                <option value="option2-2">Apartments</option>
                                            </select>
                                            
                                        </div>

                                        <div className="col" id="priceRangeFilter">
                                            <select
                                                className="form-select"
                                                id="priceRange"
                                                value={selectedOption3}
                                                onChange={handleDropdownChange3}
                                            >
                                                <option value="" disabled hidden>Price Range</option>
                                                <option value="option3-1">RM 500 - RM 1000</option>
                                                <option value="option3-2">RM 1000 - RM 1500</option>
                                                <option value="option3-3">RM 1500 - RM 2000</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        
                <section id="recommendation">
                    <header className="propertyTitle text-left fs-2 fw-bolder mt-4">Your Properties</header>
                    <div class="row row-cols-1 row-cols-md-3 g-5">
                        <div class="col">
                            <div class="card h-100">
                            <img src="Images/condo2.jpg" class="card-img-top" alt="house picture"/>
                                <div class="card-body">
                                    <h4 class="card-title1">RM 500 Per Month</h4>
                                    <h6 class="card-title2">Tiara Damansara's Master Room</h6>
                                    <p class="card-text">Tiara Damansara Condominium<br></br>Seksyen 16, 46350 Petaling Jaya, Selangor</p>
                                    
                                    <ul className="room">
                                        <li className="roomDetails"><img src="Images/bedroom.png" alt="details" width="35" height="35"/> 1</li>
                                        <li className="roomDetails"><img src="Images/bathroom.png" alt="details" width="35" height="35"/> 2</li>
                                        <li className="roomDetails"><img src="Images/sqrt.png" alt="details" width="35" height="35"/> 350sf</li>
                                    </ul>
                                    
                                    <div className="manageButton"> 
                                        <a href="#"><button id="manage" type="button">Edit</button></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col">
                            <div class="card h-100">
                            <img src="Images/commercial2.jpg" class="card-img-top" alt="house picture"/>
                            <div class="card-body">
                                <h4 class="card-title1">RM 500 Per Month</h4>
                                <h6 class="card-title2">Tiara Damansara's Master Room</h6>
                                <p class="card-text">Tiara Damansara Condominium<br></br>Seksyen 16, 46350 Petaling Jaya, Selangor</p>
                                <ul className="room">
                                    <li className="roomDetails"><img src="Images/bedroom.png" alt="details" width="35" height="35"/> 1</li>
                                    <li className="roomDetails"><img src="Images/bathroom.png" alt="details" width="35" height="35"/> 2</li>
                                    <li className="roomDetails"><img src="Images/sqrt.png" alt="details" width="35" height="35"/> 350sf</li>
                                </ul>
                                <div className="manageButton"> 
                                    <a href="#"><button id="manage" type="button">Edit</button></a>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="col">
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
                        <br /><br /><br /><br /><br />
                    </section>
            </main>
        </div>
    );
}

export default LandlordHome;