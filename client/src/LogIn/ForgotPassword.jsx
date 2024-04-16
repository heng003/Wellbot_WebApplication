import React from "react";
import Swal from 'sweetalert2'
import '../LogIn/forgotpassword.css'

const ForgotPassword = () => {

    const handleResetPasswordButton = () => {
        Swal.fire({
            title: "Check Your Email",
            titleColor: "#FF5C00",
            text: "We have sent an email to *****w455@gmail.com to verify your email address and activate your account. Link in email will expire within 24 hours.",
            imageUrl: "Images/email.png",
            imageWidth: 280,
            imageHeight: 200,
            imageAlt: "email",
            confirmButtonText: "OK", 
            confirmButtonColor: "#FF8C22"
          });
    }

    return(
        <div id="forgotPassword">
             <img src="Images/logoText.png" alt="Logo" width='150' height='150'/>
            <div class="container text-center">
                <img src="Images/lock.png" alt="Logo" width='150' height='150'/>
                    <h2 className="forgotPasswordTitle fs-2 fw-bolder mt-4">Forgot Password</h2>
                    <p className="forgotPasswordDescTitle">Enter the email address associated with your account.</p>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <div class="form-outline flex-fill mb-0">
                            <input type="email" id="email" class="form-control" placeholder="Email" required/>
                        </div>
                    </div>
                    <button id="resetPasswordButton" onClick={handleResetPasswordButton} type="button">Reset Password</button>
            </div>
        </div>
    );
}

export default ForgotPassword;