import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { faUser, faEnvelope, faPhone, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'
import '../RegisterAcc/registeracc.css'

const RegisterLandlordAcc = () => {

    const [visible, setVisible] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email:'',
        phonenumber:'',
        password:''
    })

    const [errors, setErrors] = useState({})
    const formRef = useRef(null);
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name] : value
        })
    }

    const handleRegisterClick = (e) =>{
        e.preventDefault();
        const validationErrors = {};

        if(!formData.username.trim()){
            validationErrors.username = "*username is required"
        }
        if(!formData.email.trim()){
            validationErrors.email = "*email is required"
        }else if(!/\S+@\S+\.\S+/.test(formData.email)){   // "\S+ means one or more character"
            validationErrors.email = "*email is invalid"
        }

        if(!formData.phonenumber.trim()){
            validationErrors.phonenumber = "*phone number is required"
        }else if(!/^\d{10,11}$/.test(formData.phonenumber)){   // "\S+ means one or more character"
            validationErrors.phonenumber = "*phone number is invalid"
        }

        if(!formData.password.trim()){
            validationErrors.password = "*password is required"
        }else if(formData.password.length < 6){   // "\S+ means one or more character"
            validationErrors.password = "*password should be at least 6 character"
        }

        setErrors(validationErrors)

        if (Object.keys(validationErrors).length === 0) {
            // No validation errors, show success message
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
            }).then(() => {
                // Clear the form fields
                formRef.current.reset();
                // Clear the form data
                setFormData({
                    username: '',
                    email: '',
                    phonenumber: '',
                    password: ''
                });
            });
        }
    }

    return(
        <div id="register">
            <img src="Images/logoText.png" alt="Logo" width='150' height='150'/>
            <div class="container text-center">
            <div class="row">
                <div class="col">
                    <h2 className="registerTitleLandlord fs-2 fw-bolder mt-4">Register As Landlord</h2>
                    <img src="Images/landlord.png" class="landlord" alt="landlord" width="350" height="300"/>
                </div>
                <div class="col">
                <form id="register-form" ref={formRef} onSubmit={handleRegisterClick}>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" />
                        <div class="form-outline flex-fill mb-0">
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                class="form-control" 
                                placeholder="Username" 
                                autoComplete="off" 
                                onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.username && <span>{errors.username}</span>}
                        </div>
                    </div>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faEnvelope} className="fa-lg me-3 fa-fw" />
                        <div class="form-outline flex-fill mb-0">
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                class="form-control" 
                                placeholder="Email" 
                                autoComplete="off"
                                onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                    </div>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faPhone} className="fa-lg me-3 fa-fw"/>
                        <div class="form-outline flex-fill mb-0">
                        <input 
                            type="tel" 
                            name="phonenumber" 
                            id="phonenumber" 
                            class="form-control" 
                            placeholder="Phone Number" 
                            autoComplete="off"
                            onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.phonenumber && <span>{errors.phonenumber}</span>}
                        </div>
                    </div>
                    <div class="form d-flex flex-row position-relative align-items-center mb-4">
                        <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw"/>
                        <div class="form-outline flex-fill mb-0 position-relative">
                            <input 
                                value={formData.password} 
                                type={visible ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                class="form-control" 
                                placeholder="Password" 
                                onChange={handleChange} 
                                />  
                        </div>
                        <div className="displayErrorMessage">
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                        <div className="eye-icon" onClick={() => setVisible(!visible)}>{ visible ? <FontAwesomeIcon icon={faEye} className="fa-lg me-3 fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg me-3 fa-fw"/> }</div>
                    </div>

                    <div id="bottomDetails">
                        <button id="registerButtonLandlord" type="submit">Register</button>
                        <div id="haveAcc">Already have an account? <Link className="link" to="/logIn">LOG IN</Link></div>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    );
}

export default RegisterLandlordAcc;
