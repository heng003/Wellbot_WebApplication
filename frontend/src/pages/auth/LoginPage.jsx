import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/loginPage.css';

import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = t('auth.errors.email_required');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t('auth.errors.email_invalid');
        }
        if (!password.trim()) {
            newErrors.password = t('auth.errors.password_required');
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('/api/auth/logIn', { email, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('name', response.data.user.name);
                localStorage.setItem('role', response.data.user.role);

                // Update language based on user profile
                const userLanguage = response.data.user.language;
                if (userLanguage) {
                    const langCode = userLanguage === 'Malay' ? 'ms' : userLanguage === 'Chinese' ? 'zh' : 'en';
                    i18n.changeLanguage(langCode);
                }

                const userRole = response.data.user.role;
                if (userRole === 'user') {
                    navigate('/user/dashboard/main');
                } else if (userRole === 'guardian') {
                    navigate('/guardian/monitoredUser');
                }

            } catch (errors) {
                Swal.fire({
                    title: t('auth.login_failed_title'),
                    text: errors.response.data?.message,
                    icon: "error",
                    confirmButtonText: t('auth.ok'),
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                });
                setErrors({ form: t('auth.login_failed_title') + ": " + errors.response.data.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="login-main">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">{t('auth.welcome_back')}</h1>
                        <p className="login-subtitle">{t('auth.sign_in_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">{t('auth.email_label')}</label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder={t('auth.email_placeholder')}
                                />
                            </div>
                            {errors.email && <p className="input-error">{errors.email}</p>}
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="password" className="form-label">{t('auth.password_label')}</label>
                            <div className="input-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder={t('auth.password_placeholder')}
                                />
                            </div>
                            {errors.password && <p className="input-error">{errors.password}</p>}
                        </div>

                        <div className="form-options mb-3">
                            <div className="checkbox-wrapper">
                            </div>
                            <div className="redirect-container">
                                <Link to="/forgotPassword" className="redirect-link">
                                    {t('auth.forgot_password')}
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-submit"
                            >
                                {loading ? (
                                    <span className="loader"></span>
                                ) : (
                                    <ArrowRight className="submit-icon" />
                                )}
                                {t('auth.sign_in_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
