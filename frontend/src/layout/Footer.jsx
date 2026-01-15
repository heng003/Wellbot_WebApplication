import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import "../styles/footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <footer id="footer_backgroundColor">
                <div class="social_links_row">
                    <h2>{t('footer.follow_us')}</h2>
                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#"><img src="Images/facebook_logo.png" style={{ widths: 'auto', height: '25px', marginBottom: '0.25em', marginRight: '1.2em' }} /></a>
                </div>
                <hr></hr>
                <div class="nav-footer">
                    <div class="nav_col1">
                        <ul>
                            <a href="#"><li>{t('footer.about_us')}</li></a>
                            <a href="#"><li>{t('footer.contact_us')}</li></a>
                            <a href="#"><li>{t('footer.share_feedback')}</li></a>
                        </ul>
                    </div>
                    <div class="nav_col2">
                        <ul>
                            <a href="#"><li>{t('footer.our_services')}</li></a>
                            <a href="#"><li>{t('footer.qna')}</li></a>
                        </ul>
                    </div>
                </div>
                <hr></hr>
                <div class="footer_copyright">
                    {t('footer.copyright', { year: currentYear })}
                </div>
            </footer>
        </div>
    );
}

export default Footer;