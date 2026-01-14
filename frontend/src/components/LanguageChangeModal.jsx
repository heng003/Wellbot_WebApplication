import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const LanguageChangeModal = ({
    initialLanguage,
    onClose,
    onSuccess
}) => {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation before saving
        const confirmResult = await Swal.fire({
            title: t('profile.labels.change_language') || "Change Language?",
            text: t('profile.alerts.confirm_language_desc') || "Are you sure you want to change the language?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: t('profile.buttons.yes') || "Yes",
            cancelButtonText: t('profile.buttons.cancel') || "Cancel",
            customClass: {
                title: 'swal-title',
            }
        });

        if (!confirmResult.isConfirmed) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/profile/userProfile', { websiteLanguage: selectedLanguage }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local i18n
            i18n.changeLanguage(selectedLanguage);

            // Success feedback
            Swal.fire({
                title: t('profile.alerts.success'),
                text: t('profile.alerts.language_updated') || "Language updated successfully!",
                icon: "success",
                confirmButtonColor: "var(--primary-color)",
                customClass: {
                    title: 'swal-title',
                }
            });

            if (onSuccess) onSuccess(selectedLanguage);
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: t('profile.alerts.error'),
                text: t('profile.alerts.update_failed'),
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
        <div className="modal-overlay">
            <div className="modal-container">
                <h3 className="modal-header modal-title mb-4">{t('profile.labels.website_language')}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="modal-form">
                        <div>
                            <label className="form-label">{t('profile.helpers.language_desc') || "Select your preferred language"}</label>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="form-input"
                                required
                            >
                                <option value="en">{t('profile.options.language.en')}</option>
                                <option value="ms">{t('profile.options.language.bm')}</option>
                                <option value="zh">{t('profile.options.language.cn')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
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
                            onClick={onClose}
                            className="white-button btn-outline"
                        >
                            {t('profile.buttons.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LanguageChangeModal;
