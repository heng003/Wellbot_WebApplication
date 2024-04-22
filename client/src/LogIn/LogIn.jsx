import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from "react-router-dom";
import { faUser, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../LogIn/login.css'

const LogIn = () => {

    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    //frontend demo purpose
    const handleLogin = () => {        
        if(username === "tenant") {
            navigate("/tenantHome");
        } else {
            navigate("/landlordHome");
        }
    }

    return(

        <div id="login" className="d-flex">

            <img src="Images/authe_logo.png" alt="Logo" width='140' height='140'/>

            <div className="content-section">
                <div className="left-section">
                    <h2 className="logIn_wlcTxt">Welcome Back To <br/>RentSpotter !</h2>
                    <p className="brief_txt">Direct Dialogue: Your Bridge-Free<br/> Connection to Home</p>
                    <img src="Images/signIn_pic.svg" alt="signIn_pic" width='950' height='auto' style={{marginLeft:'-14em', marginTop:'-9em'}}/>
                </div>

                <div className="right-section">
                    <div className="login-form">
                        <h2 className="loginTitle fs-2 fw-bolder mt-4">Log In</h2>

                        <div className="form align-items-center mb-4">
                            <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw"size="2x"/>
                            <input type="text" id="username" className="form-control" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
                        </div>

                        <div className="form align-items-center mb-4">
                            <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw"size="2x"/>
                            <input value={password} type={visible ? "text" : "password"} id="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                                <div className="login-eye-icon" onClick={() => setVisible(!visible)}>
                                    {visible ? <FontAwesomeIcon icon={faEye} className="fa-lg fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg fa-fw"/>}
                                </div>
                        </div>

                <Link to="/forgotPassword" className="forgot-password-link">Forgot password?</Link>
                <button id="loginbutton" type="button" onClick={handleLogin}>Log In</button>
                <p className="account-option">
                Don't have an account ? <Link to="/signIn" className="sign-up-link">SIGN UP</Link>
                </p>
                </div>
            </div>
        </div>
  </div>
);
}

export default LogIn;