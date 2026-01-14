import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from 'axios';
import PopupConsent from '../../components/PopupConsent';
import '../../styles/registerPage.css';

import { useTranslation } from "react-i18next";

const RegisterUserPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showConsent, setShowConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        preferName: '',
        age: '',
        gender: '',
        language: 'English',
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

    const capitalizeWords = (str) =>
        str.replace(/\b\w/g, char => char.toUpperCase());

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePersonalInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "fullName" ? capitalizeWords(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.age < 18) {
            scrollToTop();
            return setError('Age must be at least 18');
        }

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

    const proceedWithLogin = async () => {
        try {
            setLoading(true);
            await axios.post('/api/auth/registerUserAcc', formData);

            Swal.fire({
                title: t('auth.check_email_title'),
                titleColor: "var(--primary-color)",
                text: t('auth.check_email_text', { email: formData.email }),
                imageUrl: "Images/checkEmail.gif",
                imageHeight: 200,
                imageAlt: "email",
                confirmButtonText: "OK",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title'
                }
            }).then(() => {
                navigate('/logIn');
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    preferName: '',
                    age: '',
                    gender: '',
                    culturalBackground: '',
                    language: 'English',
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
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title'
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
                        <p className="register-subtitle">
                            {t('auth.join_message')}
                        </p>
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
                                    onChange={handlePersonalInputChange}
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
                                <label className="form-label">{t('auth.age_label')}</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">{t('auth.gender_label')}</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">{t('auth.select_gender')}</option>
                                    <option value="Male">{t('auth.male')}</option>
                                    <option value="Female">{t('auth.female')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">{t('auth.language_preference_label')}</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="English">English</option>
                                    <option value="Malay">Malay</option>
                                    <option value="Chinese">Chinese</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">
                                    {t('auth.cultural_background_label')}
                                </label>
                                <select
                                    name="culturalBackground"
                                    value={formData.culturalBackground}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">{t('auth.select_background')}</option>
                                    <option value="Malay">{t('auth.malay')}</option>
                                    <option value="Chinese">{t('auth.chinese')}</option>
                                    <option value="Indian">{t('auth.indian')}</option>
                                    <option value="Other">{t('auth.other')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">
                                    {t('auth.religious_beliefs_label')}
                                </label>
                                <select
                                    name="spiritualBeliefs"
                                    value={formData.spiritualBeliefs}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">{t('auth.select_beliefs')}</option>
                                    <option value="Islam">{t('auth.islam')}</option>
                                    <option value="Buddhism">{t('auth.buddhism')}</option>
                                    <option value="Christianity">{t('auth.christianity')}</option>
                                    <option value="Hinduism">{t('auth.hinduism')}</option>
                                    <option value="Agnostic">{t('auth.agnostic')}</option>
                                    <option value=" Atheist">{t('auth.atheist')}</option>
                                    <option value="None">{t('auth.none')}</option>
                                    <option value="Other">{t('auth.other')}</option>
                                </select>
                            </div>

                            <div className="form-full">
                                <label className="form-label">{t('auth.serial_number_label')}</label>
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

                    <p className="redirect-container">
                        {t('auth.already_have_account')}{' '}
                        <Link to="/login" className="redirect-link" onClick={scrollToTop}>
                            {t('auth.login_here')}
                        </Link>
                    </p>
                </div>
            </div>
            {showConsent && <PopupConsent setFormData={setFormData} setShowConsent={setShowConsent} proceedWithLogin={proceedWithLogin} />}
        </main>
    );
};

export default RegisterUserPage;