import React, {useState} from "react";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../GeneralPage/home.css';
import '../GeneralPage/navbar.css';
import CardProperty from "../component/CardProperty";

const TenantHome = () => {

    const [selectedOption1, setSelectedOption1] = useState("");
    const [selectedOption2, setSelectedOption2] = useState("");
    const [selectedOption3, setSelectedOption3] = useState("");
    const [isSearchClicked, setIsSearchClicked] = useState(false);

    const handleDropdownChange1 = (event) => {
        setSelectedOption1(event.target.value);
    };
    const handleDropdownChange2 = (event) => {
        setSelectedOption2(event.target.value);
    };

    const handleDropdownChange3 = (event) => {
        setSelectedOption3(event.target.value);
    };

    const handleSearchButtonClick = () => {
        setIsSearchClicked(true); 
    };

    // Array of card data objects for frontend demo
    const cardData = [
        {
        imgSrc: "Images/condo2.jpg",
        cardTitle1: "RM 500 Per Month",
        cardTitle2: "Tiara Damansara's Master Room",
        cardText: "Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor",
        roomDetails: ["1", "2", "350sf"]
        },

        {
        imgSrc: "Images/bungalow.jpg",
        cardTitle1: "RM 500 Per Month",
        cardTitle2: "Tiara Damansara's Master Room",
        cardText: "Tiara Damansara Condominium, Seksyen 16, 46350 Petaling Jaya, Selangor",
        roomDetails: ["1", "2", "350sf"]
        },
        
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
        <div>
            <main>
            <section id="Home"/>
        
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
                    <button className="searchButton" type="button" onClick={handleSearchButtonClick}>Search</button>
                </div>
            </section>

            <section id="recommendation">
                <header className="recommendationTitle text-left fs-2 fw-bolder mt-4">
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
            </main>
        </div>
    );
}

export default TenantHome;