import React, { useState, useEffect } from 'react';
import { User, Edit, Save, Lock, Eye, EyeOff, Smartphone, Shield, Bot } from 'lucide-react';
import '../../styles/profilePage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { Link, useNavigate } from 'react-router-dom';

const GuardianProfilePage = () => {
    const [personalData, setPersonalData] = useState({});
    const userId = getIdFromToken();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/profile/userProfile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setPersonalData(res.data.data);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const capitalizeWords = (str) =>
        str.replace(/\b\w/g, char => char.toUpperCase());

    const handleFullNameInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalData(prev => ({
            ...prev,
            [name]: name === "fullName" ? capitalizeWords(value) : value
        }));
    };

    const handlePersonalInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePersonalSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert('Credential not found');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/profile/userProfile', personalData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Personal information updated successfully!');
            setEditingPersonal(false);
            Swal.fire({
                title: "Success",
                text: "Personal information updated successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
            });
        } catch (err) {
            setError('Failed to update profile');
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to update profile",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
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
            setError('Password must be at least 8 characters long');
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
            const token = localStorage.getItem('token');
            await axios.post('/api/profile/changePassword', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Password changed!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordModal(false);
            Swal.fire({
                title: "Success",
                text: "Password changed successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to change password",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
            });
        } finally {
            setLoading(false);
        }
    };

    const closeModals = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <>
            <main className="main-container">
                <div className="top-bar">
                    <div className="header-section flex-column">
                        <div>
                            <h1 className="page-title">Profile</h1>
                            <p className="page-subtitle">Manage your personal information and account settings.</p>
                        </div>

                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}
                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                <div className="profile-section">
                    {/* Personal Information */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div className="flex flex-row justify-center">
                                <User size={25} className="profile-icon" />
                                Personal Information
                            </div>
                            {!editingPersonal && (
                                <button
                                    onClick={() => setEditingPersonal(true)}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                            )}
                        </div>
                        {editingPersonal ? (
                            <form onSubmit={handlePersonalSubmit} className="profile-card-content profile-form-grid">
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={personalData.fullName}
                                        onChange={handleFullNameInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Prefer Name</label>
                                    <input
                                        type="text"
                                        name="preferName"
                                        value={personalData.preferName}
                                        onChange={handlePersonalInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="profile-form-actions">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="green-button btn-primary"
                                    >
                                        {loading ? <span className="loader"></span> : <Save size={16} />}
                                        <span className="mt-1">Save Changes</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingPersonal(false)}
                                        className="white-button btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-card-content guardian-profile-info">
                                <div>
                                    <span className="profile-label">Full Name</span>
                                    <span className="profile-value">{personalData.fullName}</span>
                                </div>
                                <div>
                                    <span className="profile-label">Prefer Name</span>
                                    <span className="profile-value">{personalData.preferName}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account Settings */}
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <div className="flex flex-row justify-center">
                                <Lock size={25} className="profile-icon" />
                                Account Settings
                            </div>
                        </div>
                        <div className="profile-card-content profile-card-row-between">
                            <div className="d-flex flex-column">
                                <span className="profile-content-title">Password</span>
                                <span className="profile-content-subtitle">Password must be at least 8 characters and include a mix of letteres, numbers, and symbols</span>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="white-button btn-outline"
                                disabled={editingPersonal}
                            >
                                <Edit size={16} />
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/* Reset Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-title mb-4">Reset Password</h3>
                        <form onSubmit={handlePasswordSubmit} className="profile-form-vertical">
                            <div>
                                <label className="form-label">Current Password</label>
                                <div className="input-password">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordInputChange}
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-eye"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">New Password</label>
                                <div className="input-password">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordInputChange}
                                        className="form-input"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className="input-eye"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Confirm New Password</label>
                                <div className="input-password">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordInputChange}
                                        className="form-input"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className="input-eye"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="profile-form-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="green-button btn-primary"
                                >
                                    {loading ? <span className="loader"></span> : <Save size={16} />}
                                    <span className="mt-1">Update Password</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="white-button btn-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default GuardianProfilePage;