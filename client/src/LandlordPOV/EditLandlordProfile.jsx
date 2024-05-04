import React, { useState, useEffect } from 'react';
import "./editlandlordprofile.css";
import "./landlord_history.css";
import Swal from "sweetalert2";
import axios from 'axios';

const EditLandlordProfile = () => {
  const [userData, setUserData] = useState({
      username: '',
      email: '',
      phonenumber: '',
      fullname: '', 
      ic: '', 
  });



  const handleSaveAndSubmit = (e) => {
    Swal.fire({
      text: "Saved and Submitted!",
      icon: "success",
      confirmButtonColor: "#FF8C22",
    });
  };
  return (
    <>
      <div className="rental-history">
        <h1 className="EditTitle">Your Profile</h1>

        <div className="profileSection">
          <div className="pictureLeft_Section">
            <img
              src="Images/Edit_landlord_progile.png"
              alt="Logo"
              width="100"
              height="100"
            />
          </div>

          <div className="accountRight_Section">
            <h5 className="usernameText">UseHtt54@</h5>
            <p className="accountDetail" id="uploadproperty">
              Uploaded Properties: <span id="countProperty">2</span>
            </p>
          </div>
        </div>

        <div className="editLandlordForm">
          <div className="row" id="row2">
            <div class="col">
              <h6>FullName *</h6>
              <input
                type="text"
                name="editFullname"
                id="editFullname"
                placeholder="Enter Your FullName Stated in MyKad"
                required
              />
            </div>
            <div class="col">
              <h6>UserName *</h6>
              <input
                type="text"
                name="editUsername"
                id="editUsername"
                placeholder="Enter Your Username"
                required
              />
            </div>
          </div>

          <div className="row">
            <div class="col">
              <h6>NRIC *</h6>
              <input
                type="text"
                name="editIC"
                id="editIC"
                placeholder="Enter Your IC Number"
                required
                pattern="[0-9]{12}}"
              />
            </div>
            <div class="col">
              <h6>Phone Number *</h6>
              <input
                type="tel"
                name="editPhoneno"
                id="editPhoneno"
                placeholder="Enter Your Phone Number"
                required
                pattern="[0-9]{3}-[0-9]{7,8}"
              />
            </div>
          </div>

          <div className="row">
            <div class="col">
              <h6>Email Address *</h6>
              <input
                type="email"
                name="editEmail"
                id="editEmail"
                placeholder="Enter Your Email Address"
                required
              />
            </div>
            <div className="col"></div>
          </div>
          <p id="alertMessage">
            ** It is <span>compulsory</span> to fill in all of the above
            information before uploading your property
          </p>

          <div className="mainCentreButton">
            <button
              id="submitEdirProfileInfoBtn"
              onClick={handleSaveAndSubmit}
              type="submit"
            >
              Save & Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditLandlordProfile;