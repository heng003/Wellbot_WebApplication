import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../TenantPOV/edittenantprofile.css';
import '../LandlordPOV/landlord_history.css';
import Swal from 'sweetalert2'

const TenantApplyForm = () => {

    const nav = useNavigate();

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
            confirmButtonColor: "#FF8C22",
            customClass: {
                confirmButton: 'my-confirm-button-class'
              }
          }).then((result) => {
            if (result.isConfirmed) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                nav("/tenantApplication");
            }    
        });
    }

    return(
    
        <>
        <div className="pageMainContainer">

            <h1 className="pageMainTitle">Edit Personal Details</h1>

            <h3 className="pageMainSubTitle">Please make sure personal details are correct before proceed.</h3>
            
            <div className="editLandlordForm">

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
                        <div className="col"></div>
                    </div>
                </div>

                <div className="row-checkbox">
                    <input
                        type="checkbox"
                        id="confirmCheckbox"
                        checked={clicked}
                        onChange={handleCheckboxChange}
                        className="checkbox"
                    />
                    <label htmlFor="confirmCheckbox">I hereby confirm the information is true and allow my information to be shared with this property's landlord.</label>
                </div>

            </div>

            <div className="mainCentreButton">
                    <button id="submitEdirProfileInfoBtn" onClick={handleSaveAndSubmit} type="submit">Save & Submit</button>
            </div>

        </div>
        </>
       
    )
}
export default TenantApplyForm;