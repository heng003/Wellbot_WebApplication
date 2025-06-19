import React, { useState } from 'react';
import "../styles/registerPage.css";

const PopupConsent = ({ setFormData, setShowConsent, proceedWithLogin }) => {
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
                <h2 className="popup-title">USER CONSENT FORM</h2>
                <h3 className="popup-section-title underline">Well-Bot Emotional Monitoring and Intervention Consent Form</h3>
                <p>
                    Thank you for considering the Well-Bot service to support your mental wellness. Before we begin, we need your informed consent to track emotional data and perform interventions. Please read the following carefully and indicate your agreement.
                </p>

                <h3 className="popup-section-title underline">Clear Purpose – Why are we collecting emotional data?</h3>
                <p>
                    We collect emotional data to enhance your mental well-being by providing personalized support. This includes monitoring your emotional state to offer real-time feedback, detect potential distress, and suggest timely interventions to improve your mood and overall health.
                </p>

                <h3 className="popup-section-title underline">Type of Data Collected – What exactly is being tracked?</h3>
                <ul>
                    <li>Facial expressions (via camera every 5 minutes).</li>
                    <li>Body vital signs (via connected wearable).</li>
                    <li>Voice tone and speech patterns (via microphone on standby).</li>
                    <li>Ambient noise or music (via microphone).</li>
                </ul>

                <h3 className="popup-section-title underline">How the Data Will Be Used – For what purposes?</h3>
                <ul>
                    <li>Provide real-time feedback and mood-based interactions.</li>
                    <li>Generate mood reports for your personal review.</li>
                    <li>Activate alert systems to notify you or others of critical emotional states.</li>
                    <li>Adapt the Well-Bot’s responses to better suit your needs.</li>
                </ul>

                <h3 className="popup-section-title underline">Who Has Access – Is the data private, or shared with others?</h3>
                <ul>
                    <li>Your data is primarily private and accessible only to you through the Well-Bot interface.</li>
                    <li>With your explicit permission, data may be shared with caregivers, therapists, or authorized healthcare providers to support your wellness plan.</li>
                    <li>Data is stored securely and will not be sold or shared with third parties without your consent.</li>
                </ul>

                <h3 className="popup-section-title underline">Your Consent</h3>
                <p>
                    By agreeing to this consent, you acknowledge that you have read and understood the above information. You may withdraw your consent at any time by contacting Well-Bot support or adjusting your settings.
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
                        Yes, I give consent to track my emotional data and perform interventions as described above.
                    </label>
                </div>

                <div className="popup-actions">
                    <button
                        className="green-button"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupConsent;