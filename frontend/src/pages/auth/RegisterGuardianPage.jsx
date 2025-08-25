import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from 'axios';
import '../../styles/registerPage.css';

const RegisterGuardianPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        preferName: '',
    });

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            scrollToTop();
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await axios.post('/api/auth/registerGuardianAcc', formData);

            Swal.fire({
                title: "Check Your Email",
                titleColor: "#0D9488",
                text: "We have sent an email to " + formData.email + " to verify your email address and activate your account. Link in email will expire within 5 minutes.",
                imageUrl: "Images/checkEmail.gif",
                imageHeight: 200,
                imageAlt: "email",
                confirmButtonText: "OK",
                confirmButtonColor: "#0D9488",
                customClass: {
                    title: 'swal-title-class',
                    confirmButton: 'swal-confirm-button-class'
                }
            }).then(() => {
                scrollToTop();
                navigate('/logIn');
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    preferName: '',
                });
            });
        } catch (error) {
            console.log("Validation errors exist, not showing alert.");
            console.error(error);
            console.error("Registration Error:", error.response.data);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "An unknown error occurred",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#0D9488",
                customClass: {
                    title: 'swal-title-class',
                    confirmButton: 'my-confirm-button-class'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="register-main">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="register-title">Create Your Account</h1>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-grid">
                            <div>
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Prefer Name</label>
                                <input
                                    type="text"
                                    name="preferName"
                                    value={formData.preferName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    minLength="8"
                                />
                            </div>

                            <div>
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading && <span className="loader"></span>}
                            <span>Create Account</span>
                        </button>
                    </form>

                    <p className="login-redirect mt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="login-link" onClick={scrollToTop}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RegisterGuardianPage;
