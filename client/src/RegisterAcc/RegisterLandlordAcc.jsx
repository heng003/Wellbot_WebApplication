import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "../RegisterAcc/registeracc.css";

const RegisterLandlordAcc = () => {
  const [visible, setVisible] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = "*username is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "*email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "*email is invalid";
    }

    if (!formData.phonenumber.trim()) {
      validationErrors.phonenumber = "*phone number is required";
    } else if (!/^\d{10,11}$/.test(formData.phonenumber)) {
      validationErrors.phonenumber = "*phone number is invalid";
    }

    if (!formData.password.trim()) {
      validationErrors.password = "*password is required";
    } else if (formData.password.length < 6) {
      validationErrors.password = "*password should be at least 6 character";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        title: "Check Your Email",
        titleColor: "#FF5C00",
        text: "We have sent an email to *****tian@gmail.com to verify your email address and activate your account. Link in email will expire within 24 hours.",
        imageUrl: "Images/check_email.gif",
        imageHeight: 200,
        imageAlt: "email",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF8C22",
        customClass: {
          title: "my-title-class",
          confirmButton: "my-confirm-button-class",
        },
      }).then(() => {
        formRef.current.reset();
        setFormData({
          username: "",
          email: "",
          phonenumber: "",
          password: "",
        });
      });
    }
  };

  return (
    <div id="register">
      <img src="Images/logoText.png" alt="Logo" width="150" height="150" />
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h2 className="registerTitleLandlord fs-2 fw-bolder mt-4">
              Register As Landlord
            </h2>
            <img
              src="Images/landlord.png"
              className="landlord"
              alt="landlord"
              width="350"
            />
          </div>
          <div className="col rightCol">
            <form
              id="register-form"
              ref={formRef}
              onSubmit={handleRegisterClick}
            >
              <div className="form d-flex flex-row align-items-center mb-4">
                <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" />
                <div className="form-outline flex-fill mb-0">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                </div>
                <div className="displayErrorMessage">
                  {errors.username && <span>{errors.username}</span>}
                </div>
              </div>
              {/* Other form fields */}
              <div id="bottomDetails">
                <button id="registerButtonLandlord" type="submit">
                  Register
                </button>
                <div id="haveAcc">
                  Already have an account?{" "}
                  <Link className="link" to="/logIn">
                    LOG IN
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLandlordAcc;
