import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { User, Edit, Save, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { AiOutlineLoading } from 'react-icons/ai';
import '../../styles/profilePage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import FloatingNavbar from '../../layout/FloatingNavbar';
import LanguageChangeModal from '../../components/LanguageChangeModal';

const languageMap = {
    "en": "English",
    "bm": "Bahasa Melayu",
    "cn": "Chinese"
};

const GuardianProfilePage = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [personalData, setPersonalData] = useState({});
    const userId = getIdFromToken();
    const [dataLoading, setDataLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

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
        if (name === 'websiteLanguage') {
            i18n.changeLanguage(value);
        }
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
            setSuccess(t('profile.alerts.success'));
            setEditingPersonal(false);
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.personal_updated'),
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            setError(t('profile.alerts.error'));
            Swal.fire({
                title: t('profile.alerts.error'),
                text: err.response?.data?.message || t('profile.alerts.update_failed'),
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
                title: t('profile.alerts.error'),
                text: t('profile.alerts.password_mismatch'),
                icon: "error",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setError(t('profile.alerts.password_length'));
            Swal.fire({
                title: t('profile.alerts.error'),
                text: t('profile.alerts.password_length'),
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
            setSuccess(t('profile.alerts.password_changed'));
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordModal(false);
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.password_changed'),
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || t('profile.alerts.password_failed'));
            Swal.fire({
                title: t('profile.alerts.error'),
                text: err.response?.data?.message || t('profile.alerts.password_failed'),
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

    const handleWebsiteLanguageChange = async (e) => {
        const { value } = e.target;
        setPersonalData(prev => ({
            ...prev,
            websiteLanguage: value
        }));
        i18n.changeLanguage(value);

        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/profile/userProfile', { websiteLanguage: value }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Failed to update website language", err);
        }
    };

    const closeModals = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                                <div className="flex flex-row items-end justify-center">
                                    <User size={25} className="profile-icon" />
                                    {t('profile.personal_info')}
                                </div>
                                {!editingPersonal && (
                                    <button
                                        onClick={() => setEditingPersonal(true)}
                                        className="white-button btn-outline"
                                        disabled={editingPersonal}
                                    >
                                        <Edit size={16} />
                                        {t('profile.buttons.edit')}
                                    </button>
                                )}
                            </div>
                            {editingPersonal ? (
                                <form onSubmit={handlePersonalSubmit} className="profile-card-content profile-form-grid">
                                    <div>
                                        <label className="form-label">{t('profile.labels.full_name')}</label>
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
                                        <label className="form-label">{t('profile.labels.prefer_name')}</label>
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
                                            <span className="mt-1">{t('profile.buttons.save_changes')}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingPersonal(false)}
                                            className="white-button btn-outline"
                                        >
                                            {t('profile.buttons.cancel')}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-card-content guardian-profile-info">
                                    <div>
                                        <span className="profile-label">{t('profile.labels.full_name')}</span>
                                        <span className="profile-value">{personalData.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.prefer_name')}</span>
                                        <span className="profile-value">{personalData.preferName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.language')}</span>
                                        <span className="profile-value">{languageMap[personalData.language?.toLowerCase()] || personalData.language}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* App Settings */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row items-end justify-center">
                                    <Globe size={25} className="profile-icon" />
                                    {t('profile.app_settings') || "App Settings"}
                                </div>
                            </div>
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">{t('profile.labels.website_language') || "Website Language"}</span>
                                    <span className="profile-content-subtitle">{t('profile.helpers.language_desc') || "Select your preferred language for the interface"}</span>
                                </div>
                                <button
                                    onClick={() => setShowLanguageModal(true)}
                                    className="white-button btn-outline"
                                >
                                    <Edit size={16} />
                                    {t('profile.buttons.edit') || "Change"}
                                </button>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row items-end justify-center">
                                    <Lock size={25} className="profile-icon" />
                                    {t('profile.account_settings')}
                                </div>
                            </div>
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">{t('profile.labels.password')}</span>
                                    <span className="profile-content-subtitle">{t('profile.helpers.password_req')}</span>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    <Edit size={16} />
                                    {t('profile.buttons.reset_password')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            {/* Reset Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header modal-title">{t('profile.modals.change_password_title')}</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="modal-form">
                                <div>
                                    <label className="form-label">{t('profile.labels.current_password')}</label>
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
                                    <label className="form-label">{t('profile.labels.new_password')}</label>
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
                                    <label className="form-label">{t('profile.labels.confirm_password')}</label>
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
                                    <span className="mt-1">{t('profile.buttons.update_password')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="white-button btn-outline"
                                >
                                    {t('profile.buttons.cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Language Change Modal */}
            {showLanguageModal && (
                <LanguageChangeModal
                    initialLanguage={personalData.websiteLanguage || personalData.language || 'en'}
                    onClose={() => setShowLanguageModal(false)}
                    onSuccess={(newLang) => {
                        setPersonalData(prev => ({ ...prev, websiteLanguage: newLang }));
                        setSuccess(t('profile.alerts.language_updated') || "Language updated successfully!");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}
        </>
    );
};

export default GuardianProfilePage;