import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Edit, Save, Lock, Eye, EyeOff, Shield, Bot, Globe } from 'lucide-react';
import { AiOutlineLoading } from 'react-icons/ai';
import '../../styles/profilePage.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import FloatingNavbar from '../../layout/FloatingNavbar';
import LanguageChangeModal from '../../components/LanguageChangeModal';

const UserProfilePage = () => {
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
        'en': t('profile.options.language.en'),
        'cn': t('profile.options.language.cn'),
        'bm': t('profile.options.language.bm'),
        'english': t('profile.options.language.en'), // Fallbacks
        'chinese': t('profile.options.language.cn'),
        'malay': t('profile.options.language.bm')
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
            setSuccess(t('profile.alerts.personal_updated'));
            setEditingPersonal(false);
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.personal_updated'),
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                    cancelButton: 'swal-cancel-white'
                }
            });
        } catch (err) {
            setError(t('profile.alerts.error'));
            Swal.fire({
                title: t('profile.alerts.error'),
                text: err.response?.data?.message || t('profile.alerts.error'),
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
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
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
                setSuccess(t('profile.alerts.tracking_enabled'));
                Swal.fire({
                    title: t('profile.alerts.success'),
                    text: t('profile.alerts.tracking_enabled'),
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
                        title: t('profile.alerts.warning'),
                        text: t('profile.alerts.disable_warning'), // "You have active permissions..."
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: t('profile.alerts.disable_confirm'),
                        cancelButtonText: t('profile.alerts.disable_cancel'),
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
            setSuccess(t('profile.alerts.tracking_disabled'));
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.tracking_disabled'),
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
                title: t('profile.alerts.device_error'),
                text: t('profile.alerts.device_same'),
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
            setSuccess(t('profile.alerts.device_changed'));
            setShowDeviceModal(false);
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.device_changed'),
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
                <FloatingNavbar brandText={t('profile.title')} showProfileSettingsOption={false} />

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
                                    <div>
                                        <label className="form-label">{t('profile.labels.age')}</label>
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
                                        <label className="form-label">{t('profile.labels.gender')}</label>
                                        <select
                                            name="gender"
                                            value={personalData.gender}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="Male">{t('profile.options.gender.male')}</option>
                                            <option value="Female">{t('profile.options.gender.female')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">{t('profile.labels.language')}</label>
                                        <select
                                            name="language"
                                            value={personalData.language}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                            required
                                        >
                                            <option value="en">{t('profile.options.language.en')}</option>
                                            <option value="bm">{t('profile.options.language.bm')}</option>
                                            <option value="cn">{t('profile.options.language.cn')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">{t('profile.labels.cultural_background')}</label>
                                        <select
                                            name="culturalBackground"
                                            value={personalData.culturalBackground}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                        >
                                            <option value="">{t('profile.labels.select_background')}</option>
                                            <option value="Malay">{t('profile.options.culture.malay')}</option>
                                            <option value="Chinese">{t('profile.options.culture.chinese')}</option>
                                            <option value="Indian">{t('profile.options.culture.indian')}</option>
                                            <option value="Other">{t('profile.options.culture.other')}</option>
                                        </select>
                                    </div>
                                    <div className="span-2">
                                        <label className="form-label">{t('profile.labels.spiritual_beliefs')}</label>
                                        <select
                                            name="spiritualBeliefs"
                                            value={personalData.spiritualBeliefs}
                                            onChange={handlePersonalInputChange}
                                            className="form-input"
                                        >
                                            <option value="">{t('profile.labels.select_beliefs')}</option>
                                            <option value="Islam">{t('profile.options.beliefs.islam')}</option>
                                            <option value="Buddhism">{t('profile.options.beliefs.buddhism')}</option>
                                            <option value="Christianity">{t('profile.options.beliefs.christianity')}</option>
                                            <option value="Hinduism">{t('profile.options.beliefs.hinduism')}</option>
                                            <option value="None">{t('profile.options.beliefs.none')}</option>
                                            <option value="Other">{t('profile.options.beliefs.other')}</option>
                                        </select>
                                    </div>
                                    <div className="profile-form-actions">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="green-button btn-primary"
                                        >
                                            {loading ? <span className="loader"></span> : <Save size={16} />}
                                            <span>Save Changes</span>
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
                                <div className="profile-card-content profile-info-grid">
                                    <div>
                                        <span className="profile-label">{t('profile.labels.full_name')}</span>
                                        <span className="profile-value">{personalData.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.prefer_name')}</span>
                                        <span className="profile-value">{personalData.preferName}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.age')}</span>
                                        <span className="profile-value">{personalData.age}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.gender')}</span>
                                        <span className="profile-value">{personalData.gender}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.language')}</span>
                                        <span className="profile-value">{languageMap[personalData.language?.toLowerCase()] || personalData.language}</span>
                                    </div>
                                    <div>
                                        <span className="profile-label">{t('profile.labels.cultural_background')}</span>
                                        <span className="profile-value">{personalData.culturalBackground || t('profile.labels.not_specified')}</span>
                                    </div>
                                    <div className="span-2">
                                        <span className="profile-label">{t('profile.labels.spiritual_beliefs')}</span>
                                        <span className="profile-value">{personalData.spiritualBeliefs || t('profile.labels.not_specified')}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Early Intervention */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row items-end justify-center">
                                    <Shield size={25} className="profile-icon" />
                                    {t('profile.early_intervention')}
                                </div>
                            </div>
                            {[
                                { label: t('profile.interventions.converse'), value: "converse", subtitle: t('profile.interventions.converse_desc') },
                                { label: t('profile.interventions.journaling'), value: "journaling", subtitle: t('profile.interventions.journaling_desc') },
                                { label: t('profile.interventions.music'), value: "music", subtitle: t('profile.interventions.music_desc') },
                                { label: t('profile.interventions.gratitude'), value: "gratitude", subtitle: t('profile.interventions.gratitude_desc') },
                                { label: t('profile.interventions.quote'), value: "quote", subtitle: t('profile.interventions.quote_desc') },
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
                                                    setSuccess(t('profile.alerts.success'));
                                                    Swal.fire({
                                                        title: t('profile.alerts.success'),
                                                        text: t('profile.alerts.success_msg'),
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
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">{t('profile.labels.device_connection')}</span>
                                    <span className="profile-content-subtitle">{t('profile.helpers.device_desc')}</span>
                                </div>
                                <button
                                    onClick={() => setShowDeviceModal(true)}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    <Bot size={20} />
                                    <span>{t('profile.buttons.change_device')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Guardian Tracking */}
                        <div className="rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500">
                            <div className="profile-card-header">
                                <div className="flex flex-row items-end justify-center">
                                    <Shield size={25} className="profile-icon" />
                                    {t('profile.guardian_tracking')}
                                </div>
                            </div>
                            <div className="profile-card-content profile-card-row-between">
                                <div className="d-flex flex-column">
                                    <span className="profile-content-title">{t('profile.helpers.guardian_permission')}</span>
                                    <span className="profile-content-subtitle">{t('profile.helpers.guardian_desc_1')}</span>
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
                                    <span className="profile-content-title">{t('profile.helpers.guardian_header')}</span>
                                    <span className="profile-content-subtitle">{t('profile.helpers.guardian_desc_2')}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        scrollToTop();
                                        navigate('/user/accessManage');
                                    }}
                                    className="white-button btn-outline"
                                    disabled={editingPersonal}
                                >
                                    {t('profile.buttons.manage_access')}
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
                            <h3 className="modal-header modal-title mb-4">{t('profile.modals.change_password_title')}</h3>
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
                                        <span>{t('profile.buttons.update_password')}</span>
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
                )
            }

            {/* Change Device Modal */}
            {
                showDeviceModal && (
                    <div className="modal-overlay">
                        <div className="modal-container">
                            <h3 className="modal-header modal-title mb-4">{t('profile.buttons.change_device')}</h3>
                            <form onSubmit={handleDeviceChange}>
                                <div className="modal-form">
                                    <label className="form-label">{t('profile.labels.device_serial')}</label>
                                    <input
                                        type="text"
                                        value={serialNumberInput}
                                        onChange={e => setSerialNumberInput(e.target.value)}
                                        className="form-input"
                                        placeholder={t('profile.placeholders.device_serial')}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button
                                        type="submit"
                                        className="green-button btn-primary"
                                    >
                                        <Save size={16} />
                                        <span>{t('profile.buttons.change_device')}</span>
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
                )
            }

            {/* Language Change Modal */}
            {showLanguageModal && (
                <LanguageChangeModal
                    initialLanguage={personalData.websiteLanguage || personalData.language || 'en'}
                    onClose={() => setShowLanguageModal(false)}
                    onSuccess={(newLang) => {
                        setPersonalData(prev => ({ ...prev, websiteLanguage: newLang }));
                        setSuccess(t('profile.alerts.language_updated') || "Language updated successfully!");
                        // Scroll to top to see alert if needed, or it's fixed? 
                        // Alert is at top of main container.
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}
        </>
    );
};

export default UserProfilePage;