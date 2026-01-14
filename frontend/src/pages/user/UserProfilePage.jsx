import React, { useState, useEffect } from 'react';
import { User, Edit, Save, Lock, Eye, EyeOff, Shield, Bot } from 'lucide-react';
import { AiOutlineLoading } from 'react-icons/ai';
import '../../styles/profilePage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import FloatingNavbar from '../../layout/FloatingNavbar';

const UserProfilePage = () => {
    const [personalData, setPersonalData] = useState({});
    const userId = getIdFromToken();
    const [dataLoading, setDataLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [serialNumberInput, setSerialNumberInput] = useState('');
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/profile/userProfile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPersonalData(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setDataLoading(false);
        }
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

    const languageMap = {
        'en': 'English',
        'cn': 'Chinese',
        'bm': 'Bahasa Melayu',
        'english': 'English', // Fallbacks for legacy data
        'chinese': 'Chinese',
        'malay': 'Bahasa Melayu'
    };

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
            scrollToTop();
            setSuccess('Personal information updated successfully!');
            setEditingPersonal(false);
            Swal.fire({
                title: "Success",
                text: "Personal information updated successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            setError('Failed to update profile');
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to update profile",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
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
                text: "New passwords do not match.",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
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
                customClass: {
                    title: 'swal-title',
                }
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
            scrollToTop();
            setSuccess('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowPasswordModal(false);
            Swal.fire({
                title: "Success",
                text: "Password changed successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to change password",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGuardianTrackingToggle = async (checked) => {
        const token = localStorage.getItem('token');
        if (checked) {
            // Enabling: just update
            try {
                await axios.patch('/api/profile/guardianPermission', { allowGuardian: true }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPersonalData(prev => ({
                    ...prev,
                    allowGuardian: true
                }));
                scrollToTop();
                setSuccess('Guardian tracking enabled.');
                Swal.fire({
                    title: "Success",
                    text: "Guardian tracking enabled.",
                    icon: "success",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                });
            } catch (err) {
                setError('Failed to enable guardian tracking');
                Swal.fire({
                    title: "Error",
                    text: err.response?.data?.message || "Failed to enable guardian tracking",
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                    customClass: {
                        title: 'swal-title',
                    }
                });
            }
        } else {
            // Disabling: check for active permissions
            try {
                const res = await axios.get('/api/permission/user/activeCount', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.count > 0) {
                    Swal.fire({
                        title: "Active Guardians",
                        text: `You have ${res.data.count} granted permissions. Do you want to revoke them before disabling Guardian to send tracking requests?`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Go to Access Control",
                        cancelButtonText: "Disable Without Revoking",
                        confirmButtonColor: "var(--primary-color)",
                        cancelButtonColor: "#FFF",
                        customClass: {
                            title: 'swal-title',
                        }
                    }).then(result => {
                        if (result.isConfirmed) {
                            scrollToTop();
                            navigate('/user/accessManage');
                        }
                    });
                } else {
                    handleDisableRequest();
                }
            } catch (err) {
                setError('Failed to disable guardian tracking');
                Swal.fire({
                    title: "Error",
                    text: err.response?.data?.message || "Failed to disable guardian tracking",
                    icon: "error",
                    confirmButtonColor: "var(--primary-color)",
                });
            }
        }
    };

    const handleDisableRequest = async (e) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch('/api/profile/guardianPermission', { allowGuardian: false }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPersonalData(prev => ({
                ...prev,
                allowGuardian: false
            }));
            scrollToTop();
            setSuccess('Guardian tracking disabled.');
            Swal.fire({
                title: "Success",
                text: "Guardian tracking disabled.",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            setError('Failed to disable guardian tracking');
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "Failed to disable guardian tracking",
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        }
    };

    const closeModals = () => {
        setShowPasswordModal(false);
        setShowDeviceModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSerialNumberInput('');
    };

    // Change device
    const handleDeviceChange = async (e) => {
        e.preventDefault();
        if (personalData.serialNumber === passwordData.confirmPassword) {
            Swal.fire({
                title: "Device Error",
                text: "The new serial number cannot be the same as the current one.",
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
            const token = localStorage.getItem('token');
            await axios.post('/api/profile/changeDevice', {
                serialNumber: serialNumberInput,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            scrollToTop();
            setSuccess('Device changed successfully!');
            setShowDeviceModal(false);
            Swal.fire({
                title: "Success",
                text: "Device changed successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            Swal.fire({
                title: "Device Error",
                text: err.response?.data?.message || "Failed to change device",
                icon: "error",
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
        <>
            <main className="main-container">
                <FloatingNavbar brandText="Profile" showProfileSettingsOption={false} />

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}
                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                {dataLoading ? (
                    <div className="flex h-[50vh] w-full items-center justify-center">
                        <AiOutlineLoading className="h-12 w-12 animate-spin text-[#3E9389]" />
                    </div>
                ) : (
                    <div className="profile-section">
                        {/* Personal Information */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
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
                                    <div>
                                        <label className="form-label">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={personalData.age}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                            required
                                            min="13"
                                            max="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Gender</label>
                                        <select
                                            name="gender"
                                            value={personalData.gender}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Language</label>
                                        <select
                                            name="language"
                                            value={personalData.language}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="en">English</option>
                                            <option value="bm">Bahasa Melayu</option>
                                            <option value="cn">Chinese</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Cultural Background</label>
                                        <select
                                            name="culturalBackground"
                                            value={personalData.culturalBackground}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                        >
                                            <option value="">Select background</option>
                                            <option value="Malay">Malay</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Indian">Indian</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="span-2">
                                        <label className="form-label">Spiritual/Religious Beliefs</label>
                                        <select
                                            name="spiritualBeliefs"
                                            value={personalData.spiritualBeliefs}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
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
                                <div className="profile-card-content profile-info-grid">
                                    <div>
                                        <span className="profile-label">Full Name</span>
                                        <span className="profile-value">{personalData.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">Prefer Name</span>
                                        <span className="profile-value">{personalData.preferName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">Age</span>
                                        <span className="profile-value">{personalData.age} years old</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">Gender</span>
                                        <span className="profile-value">{personalData.gender}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">Language</span>
                                        <span className="profile-value">{languageMap[personalData.language?.toLowerCase()] || personalData.language}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">Cultural Background</span>
                                        <span className="profile-value">{personalData.culturalBackground || 'Not specified'}</span>
                                    </div>
                                    <div className="span-2">
                                        <span className="profile-label">Spiritual/Religious Beliefs</span>
                                        <span className="profile-value">{personalData.spiritualBeliefs || 'Not specified'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Early Intervention */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row justify-center">
                                    <Shield size={25} className="profile-icon" />
                                    Early Intervention Preference
                                </div>
                            </div>
                            {[
                                { label: "Converse with Context Awareness", value: "converse", subtitle: "Engage in supportive conversations with Well-Bot, helping you feel heard and understood more deeply" },
                                { label: "Voice Journaling", value: "journaling", subtitle: "Record your thoughts by speaking, making emotional expression easier and more personal without needing to type" },
                                { label: "Meditation with Calming Music", value: "music", subtitle: "Listen to guided meditation sessions paired with relaxing music to reduce stress and promote emotional balance" },
                                { label: "Make a Gratitude List", value: "gratitude", subtitle: "List down small or big things you're thankful for — a simple way to boost positivity and shift focus from stress to appreciation" },
                                { label: "Spiritual Quote of the Day", value: "quote", subtitle: "Receive a calming or inspiring quote rooted in spiritual wisdom to uplift your mood and offer perspective for the day" },
                            ].map(pref => (
                                <div className="profile-card-content profile-card-row-between" key={pref.value}>
                                    <div className="d-flex flex-column">
                                        <span className="profile-content-title">{pref.label}</span>
                                        <span className="profile-content-subtitle">{pref.subtitle}</span>
                                    </div>
                                    <div className="profile-switch">
                                        <input
                                            type="checkbox"
                                            checked={personalData.preferIntervention?.[pref.value] || false}
                                            onChange={async e => {
                                                const updated = {
                                                    ...personalData.preferIntervention,
                                                    [pref.value]: e.target.checked
                                                };
                                                setPersonalData(prev => ({
                                                    ...prev,
                                                    preferIntervention: updated
                                                }));
                                                // Call backend to update
                                                try {
                                                    setLoading(true);
                                                    const token = localStorage.getItem('token');
                                                    await axios.patch('/api/profile/preferIntervention', { preferIntervention: updated }, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    scrollToTop();
                                                    setSuccess('Intervention preferences updated successfully!');
                                                    Swal.fire({
                                                        title: "Success",
                                                        text: "Intervention preferences updated successfully!",
                                                        icon: "success",
                                                        confirmButtonColor: "var(--primary-color)",
                                                        customClass: {
                                                            title: 'swal-title',
                                                        }
                                                    });
                                                } catch (err) {
                                                    setError('Failed to update intervention preferences');
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            disabled={editingPersonal}
                                            id={`intervention-${pref.value}`}
                                        />
                                        <label htmlFor={`intervention-${pref.value}`}></label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Account Settings */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
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
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">Well-Bot Device Connection</span>
                                    <span className="profile-content-subtitle">Replace your current Well-Bot connection with another validated droid</span>
                                </div>
                                <button
                                    onClick={() => setShowDeviceModal(true)}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    <Bot size={20} />
                                    <span className="mt-1">Change Device</span>
                                </button>
                            </div>
                        </div>

                        {/* Guardian Tracking */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row justify-center">
                                    <Shield size={25} className="profile-icon" />
                                    Guardian Tracking
                                </div>
                            </div>
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">Guardian Tracking Permission</span>
                                    <span className="profile-content-subtitle">Enable caregivers to send tracking requests and monitor your well-being after getting your permission</span>
                                </div>
                                <div className="profile-switch">
                                    <input
                                        type="checkbox"
                                        checked={!!personalData.allowGuardian}
                                        onChange={async (e) => {
                                            const checked = e.target.checked;
                                            await handleGuardianTrackingToggle(checked);
                                        }}
                                        disabled={editingPersonal}
                                        id="guardian-tracking-toggle"
                                    />
                                    <label htmlFor="guardian-tracking-toggle"></label>
                                </div>
                            </div>
                            {personalData.allowGuardian && (<div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">Manage Guardian Access</span>
                                    <span className="profile-content-subtitle">View and manage guardian requests and permissions</span>
                                </div>
                                <button
                                    onClick={() => {
                                        scrollToTop();
                                        navigate('/user/accessManage');
                                    }}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    Manage Access
                                </button>
                            </div>)}
                        </div>
                    </div>

                )}
            </main >
            {/* Reset Password Modal */}
            {
                showPasswordModal && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <h3 className="modal-header modal-title mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordSubmit}>
                                <div className="modal-form">
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
                                </div>
                                <div className="modal-actions">
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
                )
            }

            {/* Change Device Modal */}
            {
                showDeviceModal && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <h3 className="modal-header modal-title mb-4">Change Well-Bot Device</h3>
                            <form onSubmit={handleDeviceChange}>
                                <div className="modal-form">
                                    <label className="form-label">New Device Serial Number</label>
                                    <input
                                        type="text"
                                        value={serialNumberInput}
                                        onChange={e => setSerialNumberInput(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter new device serial number"
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="submit"
                                        className="green-button btn-primary"
                                    >
                                        <Save size={16} />
                                        <span className="mt-1">Change Device</span>
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
                )
            }
        </>
    );
};

export default UserProfilePage;