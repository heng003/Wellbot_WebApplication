import React from "react";
import { Link } from "react-router-dom";
import "../../styles/registerRolePage.css"

const RegisterRolePage = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="register-role-session flex flex-col min-h-screen">
            <h1 className="register-role-title">What role do you Want to Register As?</h1>
            <h6 className="register-role-content-grey">To start your Wellness Journey we need to select your user type.</h6>
            <div class="row row-cols-1 row-cols-md-2 g-5">
                <div class="col">
                    <div class="card h-100">
                        <img src="Images/personalAcc.png" alt="personal" height="180" width="150.5" />
                        <h5 class="register-role-title text-center">Personal Account</h5>
                        <p className="register-role-content-black">Monitor your own emotional wellness, track your mood, and get personalized insights.</p>
                        <Link to="/registerUser"><button className="green-button" type="button" onClick={scrollToTop}>Register</button></Link>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="Images/guardianAcc.png" alt="guardian" height="180" width="190.8" />
                        <h5 class="register-role-title text-center">Guardian Account</h5>
                        <p className="register-role-content-black">Monitor multiple users' emotional trends — ideal for caregivers who want to support family, friends, or others.</p>
                        <Link to="/registerGuardian"><button className="green-button" type="button" onClick={scrollToTop}>Register</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterRolePage;