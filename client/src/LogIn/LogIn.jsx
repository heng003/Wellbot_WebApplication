import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import { faUser, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../LogIn/login.css'

const LogIn = () => {

    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(true);

    return(
        <div id="login">
             <img src="Images/logoText.png" alt="Logo" width='150' height='150'/>
            <div class="container text-center">
            <div class="row">
                <div class="col" id="pic"></div>
                <div class="col" id="login-form">
                    <h2 className="loginTitle fs-2 fw-bolder mt-4">Login</h2>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" />
                        <div class="form-outline flex-fill mb-0">
                            <input type="text" id="username" class="form-control" placeholder="Username" required/>
                        </div>
                    </div>
                    <div class="form d-flex flex-row position-relative align-items-center mb-4">
                        <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw"/>
                        <div class="form-outline flex-fill mb-0 position-relative">
                            <input value={password} type={visible ? "text" : "password"} id="password" class="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>  
                        </div>
                        <div className="eye-icon" onClick={() => setVisible(!visible)}>{ visible ? <FontAwesomeIcon icon={faEye} className="fa-lg me-3 fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg me-3 fa-fw"/> }</div>
                    </div>
                    <div className="forgotPassword">
                        <Link className="link" id="forgotpasswwordlink" to="/forgotPassword"><h6 className="forgotPassword">Forgot password?</h6></Link>
                    </div>
                    <div id="bottomDetails">
                        <Link className="link" to="/tenantHome"><button id="loginbutton" type="button">Log In</button></Link>
                        <div id="haveAcc">Don't have an account? <Link className="link" id="signuplink" to="/signIn">SIGN UP</Link></div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default LogIn;