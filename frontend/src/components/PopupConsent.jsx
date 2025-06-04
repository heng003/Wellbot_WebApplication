import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PopupConsent = ({ onConsentChange }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            MySwal.fire({
                title: 'User Consent Agreement',
                html: (
                    <div style={{ textAlign: 'left', marginTop: '0.5em' }}>
                        <p><strong>By registering for Well-Bot, you acknowledge and agree to the following:</strong></p>

                        <p className='mt-3'>Your emotional state data (including mood trends and intervention history) will be securely stored in our database to support the system's features and provide you with personalized emotional insights.</p>
                        <ul>
                            <li>Only you, the registered user, will have direct access to view and manage your emotional data.</li>
                            <li>Authorized Guardians with your Well-Bot ID can view emotional trends.</li>
                            <li>No other parties will have access.</li>
                        </ul>

                        <h4 className='mt-4'>Guardian Access Authorization</h4>
                        <p>Do you consent to allow Guardian users with your Well-Bot serial number to view your emotional state history for caregiving or therapeutic support?</p>
                        <br />
                        <p><em>You may change this setting at any time in your privacy preferences.</em></p>
                    </div>
                ),
                width: '65%',
                showCancelButton: true,
                confirmButtonText: 'Yes, I consent',
                cancelButtonText: 'No, keep it private',
                confirmButtonColor: '#4caf50',
                cancelButtonColor: '#f44336',
                allowOutsideClick: false,
                didOpen: (popup) => {
                    popup.style.paddingInline = '1em';
                    popup.style.paddingBlock = '2em';
                    const actions = Swal.getActions();
                    if (actions) actions.style.gap = '2em';
                }
            }).then((result) => {
                console.log('result', result);
                const consent = result.isConfirmed;
                console.log('consent', consent);
                if (onConsentChange) {
                    onConsentChange(consent);
                }
            });
        }, 0);

        return () => clearTimeout(timer)
    }, [onConsentChange]);

    return null;
};

export default PopupConsent;