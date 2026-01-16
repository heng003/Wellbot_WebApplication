import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../styles/registerPage.css";

const PopupConsent = ({ setFormData, setShowConsent, proceedWithLogin }) => {
    const { t } = useTranslation();
    const [checked, setChecked] = useState(false);

    const handleCheckbox = (e) => {
        setChecked(e.target.checked);
        if (setFormData) {
            setFormData(prev => ({
                ...prev,
                allowGuardian: e.target.checked
            }));
        }
    };

    const handleConfirm = async () => {
        setShowConsent(false);
        if (proceedWithLogin) await proceedWithLogin();
    };

    return (
        <div className="popup-consent-overlay">
            <div className="popup-consent-modal">
                <h2 className="popup-title">{t('auth.popup_consent.title')}</h2>
                <h3 className="popup-section-title underline">{t('auth.popup_consent.subtitle')}</h3>
                <p>
                    {t('auth.popup_consent.intro')}
                </p>

                <h3 className="popup-section-title underline">{t('auth.popup_consent.purpose_title')}</h3>
                <p>
                    {t('auth.popup_consent.purpose_desc')}
                </p>

                <h3 className="popup-section-title underline">{t('auth.popup_consent.data_type_title')}</h3>
                <ul>
                    <li>{t('auth.popup_consent.data_type_items.expressions')}</li>
                    <li>{t('auth.popup_consent.data_type_items.vitals')}</li>
                    <li>{t('auth.popup_consent.data_type_items.voice')}</li>
                </ul>

                <h3 className="popup-section-title underline">{t('auth.popup_consent.usage_title')}</h3>
                <ul>
                    <li>{t('auth.popup_consent.usage_items.feedback')}</li>
                    <li>{t('auth.popup_consent.usage_items.reports')}</li>
                    <li>{t('auth.popup_consent.usage_items.adapt')}</li>
                </ul>

                <h3 className="popup-section-title underline">{t('auth.popup_consent.access_title')}</h3>
                <ul>
                    <li>{t('auth.popup_consent.access_items.private')}</li>
                    <li>{t('auth.popup_consent.access_items.sharing')}</li>
                    <li>{t('auth.popup_consent.access_items.secure')}</li>
                </ul>

                <h3 className="popup-section-title underline">{t('auth.popup_consent.consent_title')}</h3>
                <p>
                    {t('auth.popup_consent.consent_desc')}
                </p>
                <div className="popup-checkbox-row">
                    <input
                        type="checkbox"
                        id="consent-checkbox"
                        className='checkbox'
                        checked={checked}
                        onChange={handleCheckbox}
                    />
                    <label htmlFor="consent-checkbox">
                        {t('auth.popup_consent.checkbox_label')}
                    </label>
                </div>

                <div className="popup-actions" style={{ gap: '10px' }}>
                    <button
                        className="cancel-button"
                        onClick={() => setShowConsent(false)}
                        style={{
                            backgroundColor: '#e2e8f0',
                            color: '#475569',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {t('auth.popup_consent.buttons.cancel')}
                    </button>
                    <button
                        className="green-button"
                        onClick={handleConfirm}
                        disabled={!checked}
                        style={{
                            backgroundColor: checked ? 'var(--primary-color)' : '#94a3b8',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: checked ? 'pointer' : 'not-allowed',
                            opacity: checked ? 1 : 0.7
                        }}
                    >
                        {t('auth.popup_consent.buttons.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupConsent;