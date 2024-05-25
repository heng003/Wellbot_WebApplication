import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Make sure to install axios if you haven't already
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
  const {landlordId} = useParams();

  const [formData, setFormData] = useState({
    editPropertyName: '',
    editAddress: '',
    editPostcode: '',
    editLocation: '',
    editSize: '',
    editFac: '',
    editAccesibility: '',
    editDesc: '',
    editPrice: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSelect = (index) => {
    setSelected(index);
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

    const validationErrors = {};

    // Validation
    if (!formData.editPropertyName) validationErrors.editPropertyName = "*Property name is required.";
    if (!formData.editAddress) validationErrors.editAddress = "*Address is required.";
    if (!formData.editPostcode || formData.editPostcode.length !== 5 || !/^\d+$/.test(formData.editPostcode)) validationErrors.editPostcode = "*Postcode must be 5 digits.";
    if (!formData.editLocation) validationErrors.editLocation = "*Location is required.";
    if (!selectedBedroom) validationErrors.editBedroom = "*Number of bedrooms is required.";
    if (!selectedBathroom) validationErrors.editBathroom = "*Number of bathrooms is required.";
    if (!selectedFurnish) validationErrors.editFurnish = "*Furnishing type is required.";
    if (!selectedParking) validationErrors.editParking = "*Number of parking spaces is required.";
    if (!selectedFloor) validationErrors.editFloor = "*Floor level is required.";
    if (!formData.editSize) validationErrors.editSize = "*Build-up size is required.";
    if (!formData.editFac) validationErrors.editFac = "*Facilities are required.";
    if (!formData.editAccesibility) validationErrors.editAccesibility = "*Accessibility is required.";
    if (!formData.editDesc) validationErrors.editDesc = "*Description is required.";
    if (!formData.editPrice) validationErrors.editPrice = "*Price is required.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('/api/properties/newproperty', {
          landlordId: landlordId, 
          name: formData.editPropertyName,
          type: selected, 
          address: formData.editAddress,
          location: formData.editLocation,
          postcode: formData.editPostcode,
          bedroom: selectedBedroom,
          bathroom: selectedBathroom,
          furnishing: selectedFurnish,
          parking: selectedParking,
          floorLevel: selectedFloor,
          buildUpSize: formData.editSize,
          facilities: formData.editFac,
          accessibility: formData.editAccesibility,
          price: formData.editPrice,
          description: formData.editDesc,
        });

        if (response.status === 201) {
          // Navigate to the next step or show success message
          nav("/landlordUploadPropertyPhoto");
        }
      } catch (error) {
        console.error("Error uploading property:", error);
      }
    } else {
      // Scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pageMainContainer">
      <h1 className="pageMainTitle">Upload Your Properties</h1>
      <h2 className="pageMainSubTitle">STEP 1 : FILL IN YOUR PROPERTY’S INFORMATION</h2>
      <h3 className="pageSubTitle">Choose your property type</h3>
      <div className="image-row">
        <div className="image-container" onClick={() => handleSelect("Landed")}>
          <img src={selected === "Landed" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={landed} alt="Landed" className="main-image" />
          <p className="label">Landed</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Condo")}>
          <img src={selected === "Condo" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={condo} alt="Condo" className="main-image" />
          <p className="label">Condo</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Commercial")}>
          <img src={selected === "Commercial" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={commercial} alt="Commercial" className="main-image" />
          <p className="label">Commercial</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Room")}>
          <img src={selected === "Room" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={room} alt="Room" className="main-image" />
          <p className="label">Room</p>
        </div>
      </div>
      <h3 className="pageSubTitle">Where is your property located?</h3>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Property Name</h6>
            <input
              type="text"
              name="editPropertyName"
              id="editPropertyName"
              placeholder="Eg : Tiara Damansara Condomium Unit 315/2, Pandah Indah "
              onChange={handleChange}
            />
            {errors.editPropertyName && <span className="error">{errors.editPropertyName}</span>}
          </div>
          <div className="col">
            <h6>Address</h6>
            <input
              type="text"
              name="editAddress"
              id="editAddress"
              placeholder="Eg :Jalan Perdana 2/8, Pandan Perdana, 55300 Kuala Lumput"
              onChange={handleChange}
            />
            {errors.editAddress && <span className="error">{errors.editAddress}</span>}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h6>Postcode</h6>
            <input
              type="text"
              name="editPostcode"
              id="editPostcode"
              placeholder="Enter Postcode"
              onChange={handleChange}
            />
            {errors.editPostcode && <span className="error">{errors.editPostcode}</span>}
          </div>
          <div className="col">
            <h6>Location</h6>
            <input
              type="text"
              name="editLocation"
              id="editLocation"
              placeholder="Eg: Petaling Jaya"
              onChange={handleChange}
            />
            {errors.editLocation && <span className="error">{errors.editLocation}</span>}
          </div>
        </div>
      </div>
      <h3 className="pageSubTitle">Tell us more about your property</h3>
      <div className="row" id="row2">
        <div className="col">
          <h6>Bedroom</h6>
          <select value={selectedBedroom} onChange={handleDropdownBedroomChange}>
            <option value="">-- Please Select --</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedrooms">2 Bedrooms</option>
            <option value="3 Bedrooms">3 Bedrooms</option>
            <option value="4 Bedrooms">4 Bedrooms</option>
            <option value="5 Bedrooms">5 Bedrooms</option>
            <option value="More than 5">More than 5</option>
          </select>
          {errors.editBedroom && <span className="error">{errors.editBedroom}</span>}
        </div>
        <div className="col">
          <h6>Bathroom</h6>
          <select value={selectedBathroom} onChange={handleDropdownBathroomChange}>
            <option value="">-- Please Select --</option>
            <option value="1 Bathroom">1 Bathroom</option>
            <option value="2 Bathrooms">2 Bathrooms</option>
            <option value="3 Bathrooms">3 Bathrooms</option>
            <option value="4 Bathrooms">4 Bathrooms</option>
            <option value="More than 4">More than 4</option>
          </select>
          {errors.editBathroom && <span className="error">{errors.editBathroom}</span>}
        </div>
      </div>
      <div className="row" id="row2">
        <div className="col">
          <h6>Furnishing</h6>
          <select value={selectedFurnish} onChange={handleDropdownFurnishChange}>
            <option value="">-- Please Select --</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Partially Furnished">Partially Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
          {errors.editFurnish && <span className="error">{errors.editFurnish}</span>}
        </div>
        <div className="col">
          <h6>Parking</h6>
          <select value={selectedParking} onChange={handleDropdownParkingChange}>
            <option value="">-- Please Select --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="More than 3">More than 3</option>
          </select>
          {errors.editParking && <span className="error">{errors.editParking}</span>}
        </div>
      </div>
      <div className="row" id="row2">
        <div className="col">
          <h6>Floor Level</h6>
          <select value={selectedFloor} onChange={handleDropdownFloorChange}>
            <option value="">-- Please Select --</option>
            <option value="Ground Floor">Ground Floor</option>
            <option value="1-5 Floors">1-5 Floors</option>
            <option value="6-10 Floors">6-10 Floors</option>
            <option value="11-15 Floors">11-15 Floors</option>
            <option value="16-20 Floors">16-20 Floors</option>
            <option value="21-25 Floors">21-25 Floors</option>
            <option value="26-30 Floors">26-30 Floors</option>
            <option value="More than 30 Floors">More than 30 Floors</option>
          </select>
          {errors.editFloor && <span className="error">{errors.editFloor}</span>}
        </div>
        <div className="col">
          <h6>Build-up Size (sq.ft)</h6>
          <input
            type="text"
            name="editSize"
            id="editSize"
            placeholder="Eg: 1200"
            onChange={handleChange}
          />
          {errors.editSize && <span className="error">{errors.editSize}</span>}
        </div>
      </div>
      <h3 className="pageSubTitle">Accessibility & Facilities</h3>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Facilities</h6>
            <textarea
              name="editFac"
              id="editFac"
              rows="3"
              placeholder="Eg: Swimming pool, Gym, Playground"
              onChange={handleChange}
            ></textarea>
            {errors.editFac && <span className="error">{errors.editFac}</span>}
          </div>
          <div className="col">
            <h6>Accessibility</h6>
            <textarea
              name="editAccesibility"
              id="editAccesibility"
              rows="3"
              placeholder="Eg: Near LRT, MRT, Bus Stop"
              onChange={handleChange}
            ></textarea>
            {errors.editAccesibility && <span className="error">{errors.editAccesibility}</span>}
          </div>
        </div>
      </div>
      <h3 className="pageSubTitle">Add a brief description</h3>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Description</h6>
            <textarea
              name="editDesc"
              id="editDesc"
              rows="3"
              placeholder="Eg: Spacious 3-bedroom condo with modern amenities and a beautiful view"
              onChange={handleChange}
            ></textarea>
            {errors.editDesc && <span className="error">{errors.editDesc}</span>}
          </div>
        </div>
      </div>
      <h3 className="pageSubTitle">Price</h3>
      <div className="row" id="row2">
        <div className="col">
          <h6>Price (RM)</h6>
          <input
            type="text"
            name="editPrice"
            id="editPrice"
            placeholder="Eg: 1500"
            onChange={handleChange}
          />
          {errors.editPrice && <span className="error">{errors.editPrice}</span>}
        </div>
      </div>
      <button className="btn" id="btnNext" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default UploadProperty;
