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
        <div id="login">

            <img src="Images/authe_logo.png" alt="Logo" width='140' height='140'/>

            <div className="Left_Design">
                <h2 className="logIn_wlcTxt">Welcome Back To <br></br>RentSpotter !</h2>
                <p className="brief_txt">Direct Dialogue: Your Bridge-Free<br></br> Connection to Home</p>
                <img src="Images/signIn_pic.svg" alt="signIn_pic" width='900' height='auto' style={{marginLeft:'-12em', marginTop:'-8.5em'}}/>
            </div>

            <div class="container_login text-center">
            <div class="row">
                
                <div class="col rightCol" id="login-form">
                    <h2 className="loginTitle fs-2 fw-bolder mt-4">Log In</h2>
                    <div class="form d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" />
                        <div class="form-outline flex-fill mb-0">
                            <input type="text" id="username" class="form-control" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
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
                        <button id="loginbutton" type="button" onClick={handleLogin}>Log In</button>
                        <div id="haveAcc">Don't have an account ? <Link className="link" id="signuplink" to="/signIn">SIGN UP</Link></div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default LogIn;