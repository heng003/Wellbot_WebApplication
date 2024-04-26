import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../TenantPOV/edittenantprofile.css";
import "../LandlordPOV/landlord_history.css";
import greyCircle from "./Images/greyCircle.png";
import orangeCircle from "./Images/orangeCircle.png";
import landed from "./Images/landed.png";
import condo from "./Images/condo.png";
import commercial from "./Images/commercial.png";
import room from "./Images/room.png";
import "./updateproperty.css";

const UpdateProperty = () => {
  const [selectedBedroom, setSelectedBedroom] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [selectedFurnish, setSelectedFurnish] = useState("");
  const [selectedParking, setSelectedParking] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selected, setSelected] = useState(null);
  const nav = useNavigate();

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

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    nav("/landlordEditPhoto");
  };

  return (
    <div className="pageMainContainer">
      <h1 className="pageMainTitle">Edit Your Properties</h1>

      <h3 className="pageMainSubTitle">Change your property type</h3>

      <div className="image-row">
        <div className="image-container" onClick={() => handleSelect(0)}>
          <img
            src={selected === 0 ? orangeCircle : greyCircle}
            alt="Circle"
            className="circle-image"
          />
          <img src={landed} alt="Landed" className="main-image" />
          <p className="label">Landed</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(1)}>
          <img
            src={selected === 1 ? orangeCircle : greyCircle}
            alt="Circle"
            className="circle-image"
          />
          <img src={condo} alt="Condo" className="main-image" />
          <p className="label">Condo</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(2)}>
          <img
            src={selected === 2 ? orangeCircle : greyCircle}
            alt="Circle"
            className="circle-image"
          />
          <img src={commercial} alt="Commercial" className="main-image" />
          <p className="label">Commercial</p>
        </div>
        <div className="image-container" onClick={() => handleSelect(3)}>
          <img
            src={selected === 3 ? orangeCircle : greyCircle}
            alt="Circle"
            className="circle-image"
          />
          <img src={room} alt="Room" className="main-image" />
          <p className="label">Room</p>
        </div>
      </div>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div class="col">
            <h6>Property Name</h6>
            <input
              type="text"
              name="editPropertyName"
              id="editPropertyName"
              placeholder="Enter Property Name"
              required
            />
          </div>
          <div class="col">
            <h6>Address</h6>
            <input
              type="text"
              name="editAddress"
              id="editAddress"
              placeholder="Enter Property's Address"
              required
            />
          </div>
        </div>

        <div className="row">
          <div class="col">
            <h6>Postcode</h6>
            <input
              type="text"
              name="editPostcode"
              id="editPostcode"
              placeholder="Enter Postcode"
              required
              pattern="[0-9]{5}}"
            />
          </div>
          <div class="col">
            <h6>Location</h6>
            <input
              type="text"
              name="editLocation"
              id="editLocation"
              placeholder="Eg: Petaling Jaya"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Bedroom</h6>
            <select
              name="editBedroom"
              id="editBedroom"
              required
              className="dropdwon"
              value={selectedBedroom}
              onChange={handleDropdownBedroomChange}
            >
              <option value="" disabled hidden>
                Please Select Number of Bedroom(s)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="col">
            <h6>Bathroom</h6>
            <select
              name="editBathroom"
              id="editBathroom"
              required
              className="dropdwon"
              value={selectedBathroom}
              onChange={handleDropdownBathroomChange}
            >
              <option value="" disabled hidden>
                Please Select Number of Bathroom(s)
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Furnishing</h6>
            <select
              name="editFurnish"
              id="editFurnish"
              required
              className="dropdwon"
              value={selectedFurnish}
              onChange={handleDropdownFurnishChange}
            >
              <option value="" disabled hidden>
                Please Select Type of Furnishing
              </option>
              <option value="Fully-furnished">Fully-furnished</option>
              <option value="Partially-furnished">Partially-furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
          <div className="col">
            <h6>Parking</h6>
            <select
              name="editParking"
              id="editParking"
              required
              className="dropdwon"
              value={selectedParking}
              onChange={handleDropdownParkingChange}
            >
              <option value="" disabled hidden>
                Please Select Number of Parking(s)
              </option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Floor level</h6>
            <select
              name="editFloor"
              id="editFloor"
              required
              className="dropdwon"
              value={selectedFloor}
              onChange={handleDropdownFloorChange}
            >
              <option value="" disabled hidden>
                Please Select Number of Floor
              </option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div class="col">
            <h6>Build-up Size</h6>
            <input
              type="text"
              name="editSize"
              id="editSize"
              placeholder="Enter Build-up Size"
              required
              pattern="[0-9]}"
            />
          </div>
        </div>

        <div className="row">
          <div class="col">
            <h6>Facilities</h6>
            <input
              type="text"
              name="editFac"
              id="editFac"
              placeholder="Enter Facilities"
              required
            />
          </div>
          <div class="col">
            <h6>Accesibility</h6>
            <input
              type="text"
              name="editAccesibility"
              id="editAccesibility"
              placeholder="Enter Accesibility"
              required
            />
          </div>
        </div>

        <div className="row">
          <div class="col">
            <h6>Description</h6>
            <input
              type="text"
              name="editDesc"
              id="editDesc"
              placeholder="Eg : First come first serve, don’t miss your opportunity to get this wonderful room ! "
            />
          </div>
        </div>

        <div class="col">
          <h6>Price</h6>
          <input
            type="text"
            name="editPrice"
            id="editPrice"
            placeholder="RM ----"
            required
            pattern="[0-9]}"
          />
        </div>

        <div className="applyButton">
          <button className="applyNowButton" type="button" onClick={handleNext}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProperty;
