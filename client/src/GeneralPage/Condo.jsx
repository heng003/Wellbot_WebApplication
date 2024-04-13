import React, {useState} from "react";
import './home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const Condo = () => {

  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");

  // Handler functions to update the selected value of each dropdown
  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };

  const handleDropdownChange2 = (event) => {
    setSelectedOption2(event.target.value);
  };

    return(
        <div>
            <section id="filter">
                <div className="container">
                    <header className="subTitle text-center fs-2 fw-bolder mt-4">Find Your Dream Property</header>
                    <div class="row row-cols-1 row-cols-md-2 g-5">
                        <div className="col">
                        <label htmlFor="location" className="filterTitle">Location</label>
                        <select
                            id="location"
                            className="form-select"
                            value={selectedOption1}
                            onChange={handleDropdownChange1}
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
                            value={selectedOption2}
                            onChange={handleDropdownChange2}
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
                <header className="recommendationTitle text-left fs-2 fw-bolder mt-4">Condo</header>
                <div class="row row-cols-1 row-cols-md-3 g-5">
                    <div class="col">
                        <div class="card h-100">
                        <img src="Images/condo2.jpg" class="card-img-top" alt="house picture" height={200} width={500}/>
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
                                    <button className="searchButton" type="button">View</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src="Images/bungalow.jpg" class="card-img-top" alt="house picture" height={200} width={500}/>
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
                                <button className="searchButton" type="button">View</button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <br /><br /><br /><br /><br />
                </section>
        </div>
    );
}

export default Condo;