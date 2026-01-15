import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/registerPage.css';
import { useTranslation } from "react-i18next";

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const [errors, setErrors] = useState('');
    const { id, token, role } = useParams();
    const navigate = useNavigate();

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResetButton = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Swal.fire({
                title: t('auth.errors.error_title') || "Error",
                text: t('auth.errors.password_mismatch'),
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setErrors(t('auth.errors.password_length'));
            Swal.fire({
                title: t('auth.errors.error_title') || "Error",
                text: t('auth.errors.password_length'),
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
            return;
        }


        setLoading(true);
        try {
            const response = await axios.post(`/api/auth/resetPassword/${id}/${token}/${role}`, { password: passwordData.newPassword });
            setLoading(false);
            if (response.data) {
                Swal.fire({
                    text: t('auth.errors.reset_success'),
                    icon: "success",
                    confirmButtonText: t('auth.ok'),
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title'
                    }
                }).then((result) => {
                    navigate('/login');
                });
                setPasswordData({ newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            setLoading(false);
            console.error("Reset Password Error:", error);
            Swal.fire({
                title: t('auth.errors.backend_error') || "Error!",
                text: error.response.data.message,
                icon: "error",
                confirmButtonText: t('auth.ok'),
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        }
    };

    return (
        <main className="register-main">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <h1 className="register-title">{t('auth.reset_password_page.title')}</h1>
                    </div>

                    {errors && <div className="error-box">{errors}</div>}

                    <form onSubmit={handleResetButton} className="register-form">
                        <div className="form-full">
                            <div>
                                <label className="form-label">{t('auth.reset_password_page.new_password')}</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="form-input"
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>
                        <div className="form-full">
                            <div>
                                <label className="form-label">{t('auth.reset_password_page.confirm_password')}</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    className="form-input"
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading && <span className="loader"></span>}
                            <span>{t('auth.reset_password_page.reset_button')}</span>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPasswordPage;
