import React, {useState} from "react";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../GeneralPage/home.css';
import CardProperty from "../component/CardProperty";

const TenantHome = () => {

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
            <section id="Home">
                <div className="container">
                    <img src="Images/generalPageBackground.png" id='backgroundImg'/>
                </div>
            </section>
        
            <section id="filter">
                <div className="container">
                    <header className="subTitle text-center fs-2 fw-bolder mt-4">Find Your Dream Property</header>
                    <div class="row row-cols-1 row-cols-md-3 g-5">
                        <div className="col">
                        <label htmlFor="propertyType" className="filterTitle">Property Type</label>
                        <select
                            className="form-select"
                            id="propertyType"
                            value={selectedOption1}
                            onChange={handleDropdownChange1}
                        >
                            <option value="" disabled hidden>Please Select</option>
                            <option value="option1-1">Condo</option>
                            <option value="option1-2">Commercial</option>
                            <option style={{ fontSize: '16px', padding: '8px', color: '#333' }} value="option1-3">Landed</option>
                        </select>
                        </div>
                        <div className="col">
                        <label htmlFor="location" className="filterTitle">Location</label>
                        <select
                            id="location"
                            className="form-select"
                            value={selectedOption2}
                            onChange={handleDropdownChange2}
                        >
                            <option value="" disabled hidden>Please Select</option>
                            <option value="option2-1">Petaling Jaya</option>
                            <option value="option2-2">Cheras</option>
                            <option value="option2-3">Kajang</option>
                            <option value="option2-3">Ampang</option>
                        </select>
                        </div>
                        <div className="col">
                        <label htmlFor="priceRange" className="filterTitle">Price Range</label>
                        <select
                            id="priceRange"
                            className="form-select"
                            value={selectedOption3}
                            onChange={handleDropdownChange3}
                        >
                            <option value="" disabled hidden>Please Select</option>
                            <option value="option3-1">RM 500 - RM 1000</option>
                            <option value="option3-2">RM 1000 - RM 1500</option>
                            <option value="option3-3">RM 1500 - RM 2000</option>
                        </select>
                        </div>
                    </div>
                    <button className="searchButton" type="button">Search</button>
                </div>
            </section>

            <section id="recommendation">
                <header className="recommendationTitle text-left fs-2 fw-bolder mt-4">Recommendations</header>
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
                                
                                <div className="viewButton"> 
                                    <a href="#"><button className="searchButton" type="button">View</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src="Images/bungalow.jpg" class="card-img-top" alt="house picture"/>
                        <div class="card-body">
                            <h4 class="card-title1">RM 500 Per Month</h4>
                            <h6 class="card-title2">Tiara Damansara's Master Room</h6>
                            <p class="card-text">Tiara Damansara Condominium<br></br>Seksyen 16, 46350 Petaling Jaya, Selangor</p>
                                <ul className="room">
                                    <li className="roomDetails"><img src="Images/bedroom.png" alt="details" width="35" height="35"/> 1</li>
                                    <li className="roomDetails"><img src="Images/bathroom.png" alt="details" width="35" height="35"/> 2</li>
                                    <li className="roomDetails"><img src="Images/sqrt.png" alt="details" width="35" height="35"/> 350sf</li>
                                </ul>
                            <div className="viewButton"> 
                                <a href="#"><button className="searchButton" type="button">View</button></a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src="Images/commercial.jpg" class="card-img-top" alt="house picture"/>
                        <div class="card-body">
                            <h4 class="card-title1">RM 500 Per Month</h4>
                            <h6 class="card-title2">Tiara Damansara's Master Room</h6>
                            <p class="card-text">Tiara Damansara Condominium<br></br>Seksyen 16, 46350 Petaling Jaya, Selangor</p>
                            <ul className="room">
                                <li className="roomDetails"><img src="Images/bedroom.png" alt="details" width="35" height="35"/> 1</li>
                                <li className="roomDetails"><img src="Images/bathroom.png" alt="details" width="35" height="35"/> 2</li>
                                <li className="roomDetails"><img src="Images/sqrt.png" alt="details" width="35" height="35"/> 350sf</li>
                            </ul>
                            <div className="viewButton"> 
                                <a href="#"><button className="searchButton" type="button">View</button></a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="col">
                        <CardProperty
                            imgSrc="Images/commercial2.jpg"
                            cardTitle1="RM 500 Per Month"
                            cardTitle2="Tiara Damansara's Master Room"
                            cardText="Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor"
                            roomDetails={["1", "2", "350sf"]}
                        />
                    </div>
                    </div>
                    <br /><br /><br /><br /><br />
                </section>
            </main>
        </div>
    );
}

export default TenantHome;