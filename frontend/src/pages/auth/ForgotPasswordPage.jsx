import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/loginPage.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!email.trim()) {
            validationErrors.email = "*Please enter your email"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "*email is invalid"
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            try {
                await axios.post('/api/auth/forgotPassword', { email });
                Swal.fire({
                    title: "Check Your Email",
                    text: "We have sent an email to " + email + " to reset your password. Link in email will expire within 5 minutes.",
                    imageUrl: "Images/checkEmail.gif",
                    imageHeight: 200,
                    imageAlt: "email",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#0d9488",
                    customClass: {
                        title: 'my-title-class-login',
                        confirmButton: 'my-confirm-button-class',
                        text: 'my-loginText-class'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEmail(""); // Clear the email input after successful operation
                    }
                });
            } catch (error) {
                console.error(error);
                console.error("Reset Password Error:", error.response?.data);
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An unknown error occurred",
                    icon: "error",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class',
                        confirmButton: 'my-confirm-button-class'
                    }
                });
            }
        }
    };

    return (
        <main className="login-main">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Forgot Password</h1>
                        <p className="login-subtitle">Enter the email address associated with your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="input-error">{errors.email}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-submit"
                            >
                                {loading ? (
                                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="spinner-fg" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    <ArrowRight className="submit-icon" />
                                )}
                                Reset Password
                            </button>
                        </div>
                    </form>

                    <div className="signup-link">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;