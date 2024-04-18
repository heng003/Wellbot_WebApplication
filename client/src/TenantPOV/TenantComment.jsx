import React, { useState } from 'react';
import '../LandlordPOV/editlandlordprofile.css';
import '../LandlordPOV/landlord_history.css';
import Swal from 'sweetalert2'
import starDefault from '../LandlordPOV/Rental_Icon/rating_star_default.svg';
import starOnClick from '../LandlordPOV/Rental_Icon/rating_star_onClick.svg';

const TenantComment = () => {

    const [ratings, setRatings] = useState(Array(5).fill(false));

    const handleStarClick = (index) => {

        const newRatings = new Array(ratings.length).fill(false);
       
        const fillUpTo = (ratings[index] && !ratings.some((active, idx) => active && idx > index)) ? index : index + 1;
    
       
        for (let i = 0; i < fillUpTo; i++) {
            newRatings[i] = true;
        }

        setRatings(newRatings);
    };

    const handleStarHover = (index, value) => {  
    };

    const handleSaveAndSubmit = (e) =>{

        Swal.fire({
            text: "Saved and Submitted!",
            icon: "success",
            confirmButtonColor: "#FF8C22",

            customClass: {
                confirmButton: 'my-confirm-button-class',
                image: 'my-custom-image-class'   
              }
            
          });
    }


    return(
        <>
        <div className="rental-history">
            <h1 className="rentalTitle">Rate & Comment Your Landlord</h1>
        
            <div className="profileSection">
                <div className="pictureLeft_Section">
                    <img src="Images/Edit_landlord_progile.png" alt="Logo" width='100' height='100'/>
                </div>

                <div className="accountRight_Section">
                    <h5 className="usernameText">Steoh2345@6</h5>
                    <p  className='accountDetail'id="accDetails">Account had been created 2 years before.</p>
                </div>
            </div>



            <div className="commentForm">

               <h5 className="commenth5">Your review is helpful to other tenants. Feel free to share your feedback with them based on below aspects.</h5>


                <div className="Rate">

                    <h3>Rate Your Overall Experience</h3>

                    <div className="starAlone">
                        {ratings.map((isActive, index) => (
                            <img
                                key={index}
                                className='RatingStar_row'
                                src={isActive ? starOnClick : starDefault}
                                alt="Rating Star"
                                width='85'
                                height='85'
                                onClick={() => handleStarClick(index)}
                                onMouseEnter={() => handleStarHover(index, true)}
                                onMouseLeave={() => handleStarHover(index, false)}
                            />
                        ))}
                    </div>

                </div>

                <div className="comment">

                    <div className="line"></div>

                    <h3>Additional Comment</h3>

                    <div className="additional-form">
                        <textarea
                            name="additionalComment"
                            id="additionalComment"
                            rows="5" 
                            placeholder="Rate your experience with rent collection, property upkeep, landlord communication, lease compliance, and neighbor relations management."
                        required></textarea>
                    </div>

                </div>

                <div className="centreButton">
                    <button id="submitEdirProfileInfoBtn" onClick={handleSaveAndSubmit} type="submit">Save & Submit</button>
                </div>

           </div>      
        </div>
        </>
    )
}

export default TenantComment;