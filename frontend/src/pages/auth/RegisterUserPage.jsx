import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from 'axios';
import PopupConsent from '../../components/PopupConsent';
import '../../styles/registerPage.css';

const RegisterUserPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showConsent, setShowConsent] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        username: '',
        age: '',
        gender: '',
        language: 'english',
        culturalBackground: '',
        spiritualBeliefs: '',
        serialNumber: '',
        allowGuardian: false
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
            setShowConsent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
            scrollToTop();
        }
    };

    const handleConsentClick = async (consent) => {
        setShowConsent(false);
        setFormData(prev => ({ ...prev, allowGuardian: consent }));
        await proceedWithLogin();
    };


    const proceedWithLogin = async () => {
        try {
            await axios.post('/api/auth/registerUserAcc', formData);

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
                    confirmButton: 'my-confirm-button-class'
                }
            }).then(() => {
                navigate('/logIn');
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullname: '',
                    username: '',
                    age: '',
                    gender: '',
                    culturalBackground: '',
                    language: 'english',
                    spiritualBeliefs: '',
                    serialNumber: '',
                    allowGuardian: false
                });
            });
        } catch (error) {
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
        }
    };

    return (
        <main className="register-main">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="register-title">Create Your Account</h1>
                        <p className="register-subtitle">
                            Join Well-Bot and start your wellness journey
                        </p>
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
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    max="120"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Language Preference</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="english">English</option>
                                    <option value="malay">Malay</option>
                                    <option value="chinese">Chinese</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">
                                    Cultural Background
                                </label>
                                <select
                                    name="culturalBackground"
                                    value={formData.culturalBackground}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select background</option>
                                    <option value="Malay">Malay</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">
                                    Religious Beliefs
                                </label>
                                <select
                                    name="spiritualBeliefs"
                                    value={formData.spiritualBeliefs}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Select beliefs</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Buddhism">Buddhism</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="None">None</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-full">
                                <label className="form-label">Well-Bot Serial Number</label>
                                <input
                                    type="text"
                                    name="serialNumber"
                                    value={formData.serialNumber}
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

                        <button type="submit" className="submit-btn">Create Account</button>
                    </form>

                    <p className="login-redirect">
                        Already have an account?{' '}
                        <Link to="/login" className="login-link" onClick={scrollToTop}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
            {showConsent && <PopupConsent onConsentChange={handleConsentClick} />}
        </main>
    );
};

export default RegisterUserPage;