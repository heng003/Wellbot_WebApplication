import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../TenantPOV/edittenantprofile.css";
import "../LandlordPOV/landlord_history.css";
import greyCircle from "./Images/greyCircle.png";
import orangeCircle from "./Images/orangeCircle.png";
import landed from "./Images/landed.png";
import condo from "./Images/condo.png";
import commercial from "./Images/commercial.png";
import room from "./Images/room.png";
import "./updateproperty.css";

const UploadProperty = () => {
  const [selectedBedroom, setSelectedBedroom] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [selectedFurnish, setSelectedFurnish] = useState("");
  const [selectedParking, setSelectedParking] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    editPropertyName: '',
    editAddress: '',
    editPostcode: "",
    editLocation: "",
    editSize: "",
    editFac: "",
    editAccesibility: "",
    editDesc: "",
    editPrice: "",
    email: "yjliew455@gmail.com", // Example landlord email, should be dynamic in real use
    type: ""
  });

  const handleDropdownBedroomChange = (event) => {
    setSelectedBedroom(event.target.value);
  };

  const handleDropdownBathroomChange = (event) => {
    setSelectedBathroom(event.target.value);
  };

  const handleDropdownFurnishChange = (event) => {
    setSelectedFurnish(event.target.value);
  };

  const handleDropdownParkingChange = (event) => {
    setSelectedParking(event.target.value);
  };

  const handleDropdownFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  const handleSelect = (index, type) => {
    setSelected(index);
    setFormData({ ...formData, type });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/properties', {
        ...formData,
        bedroom: selectedBedroom,
        bathroom: selectedBathroom,
        furnishing: selectedFurnish,
        parking: selectedParking,
        floorLevel: selectedFloor
      });
      console.log(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      nav("/landlordUploadPropertyPhoto");
    } catch (error) {
      console.error('There was an error uploading the property!', error);
    }
  };

  return (
    <div className="pageMainContainer">
      <h1 className="pageMainTitle">Upload Your Properties</h1>
      <h2 className="pageMainSubTitle">STEP 1 : FILL IN YOUR PROPERTY’S INFORMATION</h2>
      <h3 className="pageSubTitle">Choose your property type</h3>
      <div className="image-row">
        <div className="image-container" onClick={() => handleSelect(0, 'Landed')}>
          <img src={selected === 0 ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={landed} alt="Landed" className="main-image" />
          <p className="label">Landed</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(1, 'Condo')}>
          <img src={selected === 1 ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={condo} alt="Condo" className="main-image" />
          <p className="label">Condo</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(2, 'Commercial')}>
          <img src={selected === 2 ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={commercial} alt="Commercial" className="main-image" />
          <p className="label">Commercial</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(3, 'Room')}>
          <img src={selected === 3 ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={room} alt="Room" className="main-image" />
          <p className="label">Room</p>
        </div>
      </div>
      <h3 className="pageSubTitle">Where is your property located?</h3>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Property Name</h6>
            <input type="text" name="editPropertyName" id="editPropertyName" placeholder="Eg : Tiara Damansara Condomium Unit 315/2, Pandah Indah" onChange={handleChange} />
          </div>
          <div className="col">
            <h6>Address</h6>
            <input type="text" name="editAddress" id="editAddress" placeholder="Eg : Jalan Perdana 2/8, Pandan Perdana, 55300 Kuala Lumpur" onChange={handleChange} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h6>Postcode</h6>
            <input type="text" name="editPostcode" id="editPostcode" placeholder="Eg : 55300" onChange={handleChange} />
          </div>
          <div className="col">
            <h6>Location</h6>
            <input type="text" name="editLocation" id="editLocation" placeholder="Eg : Cheras, KL" onChange={handleChange} />
          </div>
        </div>
        <h3 className="pageSubTitle">Details of your property</h3>
        <div className="row" id="row2">
          <div className="col">
            <h6>Bedrooms</h6>
            <select value={selectedBedroom} onChange={handleDropdownBedroomChange}>
              <option value="" disabled>Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="col">
            <h6>Bathrooms</h6>
            <select value={selectedBathroom} onChange={handleDropdownBathroomChange}>
              <option value="" disabled>Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="row" id="row2">
          <div className="col">
            <h6>Furnishing</h6>
            <select value={selectedFurnish} onChange={handleDropdownFurnishChange}>
              <option value="" disabled>Select</option>
              <option value="Furnished">Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
          <div className="col">
            <h6>Parking</h6>
            <select value={selectedParking} onChange={handleDropdownParkingChange}>
              <option value="" disabled>Select</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="row" id="row2">
          <div className="col">
            <h6>Floor Level</h6>
            <select value={selectedFloor} onChange={handleDropdownFloorChange}>
              <option value="" disabled>Select</option>
              <option value="Ground">Ground</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="col">
            <h6>Build-up Size (sqft)</h6>
            <input type="text" name="editSize" id="editSize" placeholder="Eg : 1100" onChange={handleChange} />
          </div>
        </div>
        <div className="row" id="row2">
          <div className="col">
            <h6>Facilities</h6>
            <input type="text" name="editFac" id="editFac" placeholder="Eg : Gymnasium, Swimming Pool" onChange={handleChange} />
          </div>
          <div className="col">
            <h6>Accessibility</h6>
            <input type="text" name="editAccesibility" id="editAccesibility" placeholder="Eg : 3 mins walk to TTDI MRT Station" onChange={handleChange} />
          </div>
        </div>
        <h3 className="pageSubTitle">Additional Information</h3>
        <div className="row" id="row2">
          <div className="col">
            <h6>Price (RM)</h6>
            <input type="text" name="editPrice" id="editPrice" placeholder="Eg : 2000" onChange={handleChange} />
          </div>
          <div className="col">
            <h6>Description</h6>
            <input type="text" name="editDesc" id="editDesc" placeholder="Eg : Newly renovated, ideal for small family." onChange={handleChange} />
          </div>
        </div>
        <div className="buttonContainer">
          <button className="cancelButton" type="button" onClick={() => nav("/landlordUploadPropertyPhoto")}>Cancel</button>
          <button className="nextButton" type="submit" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default UploadProperty;
