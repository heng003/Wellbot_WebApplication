import React, { useState } from "react";
import './edittenantprofile.css';
import Swal from 'sweetalert2'

const TenantApplyForm = () => {

    const [selectedGender, setSelectedGender] = useState("");
    const [clicked, setClicked] = useState(false);

    const handleDropdownGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const handleCheckboxChange = () => {
        setClicked(!clicked); 
    };
    
    const handleSaveAndSubmit = (e) =>{
        Swal.fire({
            text: "Saved and Submitted!",
            icon: "success",
            confirmButtonColor: "#FF8C22"
          });
    }

    return(
        <div id="editContainer">
            <h1 className="edit-title">Edit Personal Details</h1>
            
            <div id="editLandlordForm">
                <div className="row" id="row2">
                    <div className="col">
                        <h6>FullName *</h6>
                        <input type="text" name="editFullname" id="editFullname" placeholder="Enter Your FullName Stated in MyKad" required/>
                    </div>
                    <div className="col">
                        <h6>UserName *</h6>
                        <input type="text" name="editUsername" id="editUsername" placeholder="Enter Your Username" required/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6>NRIC *</h6>
                        <input type="text" name="editIC" id="editIC" placeholder="Enter Your IC Number" required pattern="[0-9]{12}}" />
                    </div>
                    <div className="col">
                        <h6>Phone Number *</h6>
                        <input type="tel" name="editPhoneno" id="editPhoneno" placeholder="Enter Your Phone Number" required pattern="[0-9]{3}-[0-9]{7,8}"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h6>Email Address *</h6>
                        <input type="email" name="editEmail" id="editEmail" placeholder="Enter Your Email Address" required/>
                    </div>
                    <div className="col">
                        <h6>Gender *</h6>
                        <select name="editGender" id="editGender" required className="gender-dropdownlist" value={selectedGender} onChange={handleDropdownGenderChange}>
                            <option value="" disabled hidden style={{ color: '#E6E6E6' }}>Please Select Your Gender</option>
                            <option value="male">Male</option>
                            <option style={{ fontSize: '16px', padding: '10px', color: '#333' }} value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <h6>Remarks</h6>
                        <input type="text" name="editRemarks" id="editRemarks" placeholder="Eg: Price Negotiable"/>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
            <div className="row-checkbox">
                <input
                    type="checkbox"
                    id="confirmCheckbox"
                    checked={clicked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="confirmCheckbox">I hereby confirm the information is true and allow my information to be shared with this property's landlord.</label>
            </div>

            <button id="submitApplicationBtn" onClick={handleSaveAndSubmit} type="submit">Submit</button>

        </div>
    )
}

export default TenantApplyForm;