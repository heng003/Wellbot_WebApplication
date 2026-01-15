import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from 'axios';
import '../../styles/registerPage.css';

import { useTranslation } from "react-i18next";

const RegisterGuardianPage = () => {
    const { t } = useTranslation();
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
            return setError(t('auth.errors.password_mismatch'));
        }

        try {
            setError('');
            setLoading(true);
            await axios.post('/api/auth/registerGuardianAcc', formData);

            Swal.fire({
                title: t('auth.check_email_title'),
                titleColor: "var(--primary-color)",
                text: t('auth.check_email_text', { email: formData.email }),
                imageUrl: "Images/checkEmail.gif",
                imageHeight: 200,
                imageAlt: "email",
                confirmButtonText: t('auth.ok'),
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title'
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
                title: t('auth.errors.backend_error') || "Error!",
                text: error.response?.data?.message || t('auth.errors.unknown_error'),
                icon: "error",
                confirmButtonText: t('auth.ok'),
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
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
                        <h1 className="register-title">{t('auth.create_account')}</h1>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-grid">
                            <div>
                                <label className="form-label">{t('auth.email_label')}</label>
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
                                <label className="form-label">{t('auth.full_name_label')}</label>
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
                                <label className="form-label">{t('auth.prefer_name_label')}</label>
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
                                <label className="form-label">{t('auth.password_label')}</label>
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
                                <label className="form-label">{t('auth.confirm_password_label')}</label>
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
                            <span>{t('auth.create_account_button')}</span>
                        </button>
                    </form>

                    <p className="redirect-container mt-2">
                        {t('auth.already_have_account')}{' '}
                        <Link to="/login" className="redirect-link" onClick={scrollToTop}>
                            {t('auth.login_here')}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default RegisterGuardianPage;
