import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import '../../styles/registerPage.css';

const ResetPasswordPage = () => {
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
                title: "Error",
                text: "New passwords do not match",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setErrors('Password must be at least 8 characters long');
            Swal.fire({
                title: "Error",
                text: "Password must be at least 8 characters long",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
            return;
        }


        setLoading(true);
        try {
            const response = await axios.post(`/api/auth/resetPassword/${id}/${token}/${role}`, { password: passwordData.newPassword });
            setLoading(false);
            if (response.data) {
                Swal.fire({
                    text: "Your password has been reset successfully.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        confirmButton: 'my-confirm-button-class-success'
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
                title: "Error!",
                text: error.response.data.message,
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "var(--primary-color)",
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
                        <h1 className="register-title">Reset Password</h1>
                    </div>

                    {errors && <div className="error-box">{errors}</div>}

                    <form onSubmit={handleResetButton} className="register-form">
                        <div className="form-full">
                            <div>
                                <label className="form-label">New Password</label>
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
                                <label className="form-label">Confirm Password</label>
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
                            <span>Reset Password</span>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPasswordPage;
