import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/loginPage.css';
import { useTranslation } from "react-i18next";

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        email: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!email.trim()) {
            validationErrors.email = t('auth.errors.email_required')
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = t('auth.errors.email_invalid')
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            setLoading(true);
            try {
                await axios.post('/api/auth/forgotPassword', { email });
                setLoading(false);
                Swal.fire({
                    title: t('auth.forgot_password_page.email_sent_title'),
                    text: t('auth.forgot_password_page.email_sent_desc', { email }),
                    imageUrl: "Images/checkEmail.gif",
                    imageHeight: 200,
                    imageAlt: "email",
                    confirmButtonText: t('auth.ok'),
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEmail(""); // Clear the email input after successful operation
                    }
                });
            } catch (error) {
                setLoading(false);
                console.error(error);
                console.error("Reset Password Error:", error.response?.data);
                Swal.fire({
                    title: t('auth.errors.backend_error') || "Error!",
                    text: error.response?.data?.message || t('auth.errors.unknown_error'),
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
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
                        <h1 className="login-title">{t('auth.forgot_password_page.title')}</h1>
                        <p className="login-subtitle">{t('auth.forgot_password_page.subtitle')}</p>
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

                        <div>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? <span className="loader"></span> : <ArrowRight className="submit-icon" />}
                                {t('auth.forgot_password_page.reset_button')}
                            </button>
                        </div>
                    </form>

                    <div className="redirect-container">
                        <p>
                            {t('auth.forgot_password_page.no_account')}{' '}
                            <Link to="/registerRole" className="redirect-link">
                                {t('auth.forgot_password_page.sign_up')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;