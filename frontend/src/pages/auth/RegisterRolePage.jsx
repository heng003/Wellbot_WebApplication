import React from "react";
import { Link } from "react-router-dom";
import "../../styles/registerRolePage.css"

import { useTranslation } from "react-i18next";

const RegisterRolePage = () => {
    const { t } = useTranslation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="register-role-session flex flex-col min-h-screen">
            <h1 className="register-role-title">{t('auth.role_selection_title')}</h1>
            <h6 className="register-role-content-grey">{t('auth.role_selection_subtitle')}</h6>
            <div className="row row-register-roles">
                <div className="col">
                    <Link to="/registerUser" onClick={scrollToTop} style={{ textDecoration: 'none' }}>
                        <div className="card h-100 card-hover">
                            <img src="Images/personalAcc.png" alt="personal" height="180" width="150.5" />
                            <h5 className="register-role-title text-center">{t('auth.personal_account_title')}</h5>
                            <p className="register-role-content-black">
                                {t('auth.personal_account_desc')}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="col">
                    <Link to="/registerGuardian" onClick={scrollToTop} style={{ textDecoration: 'none' }}>
                        <div className="card h-100 card-hover">
                            <img src="Images/guardianAcc.png" alt="guardian" height="180" width="190.8" />
                            <h5 className="register-role-title text-center">{t('auth.guardian_account_title')}</h5>
                            <p className="register-role-content-black">
                                {t('auth.guardian_account_desc')}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterRolePage;