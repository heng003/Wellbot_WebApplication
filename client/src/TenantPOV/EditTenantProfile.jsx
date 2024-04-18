import React, { useState } from "react";
import '../TenantPOV/edittenantprofile.css';
import '../LandlordPOV/editlandlordprofile.css';
import '../LandlordPOV/landlord_history.css';
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
    
        <>
        <div className="rental-history">

            <h1 className="rentalTitle">Edit Personal Details</h1>

            <h3 className="instructionText">Please make sure personal details are correct before proceed.</h3>
            
            <div className="ApplyForm">

                <div className="row" id="row2">
                    <div class="col">
                        <h6>FullName *</h6>
                        <input type="text" name="editFullname" id="editFullname" placeholder="Enter Your FullName Stated in MyKad" required/>
                    </div>
                    <div class="col">
                        <h6>UserName *</h6>
                        <input type="text" name="editUsername" id="editUsername" placeholder="Enter Your Username" required/>
                    </div>
                </div>

                <div className="row">
                    <div class="col">
                        <h6>NRIC *</h6>
                        <input type="text" name="editIC" id="editIC" placeholder="Enter Your IC Number" required pattern="[0-9]{12}}" />
                    </div>
                    <div class="col">
                        <h6>Phone Number *</h6>
                        <input type="tel" name="editPhoneno" id="editPhoneno" placeholder="Enter Your Phone Number" required pattern="[0-9]{3}-[0-9]{7,8}"/>
                    </div>
                </div>

                <div className="row">
                    <div class="col">
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

            <div className="centreButton">
                    <button id="submitEdirProfileInfoBtn" onClick={handleSaveAndSubmit} type="submit">Save & Submit</button>
            </div>

        </div>
        </>
       
    )
}
export default TenantApplyForm;