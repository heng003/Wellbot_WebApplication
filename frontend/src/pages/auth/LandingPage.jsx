import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CardFeature from "../../components/CardFeature";
import "../../styles/landingPage.css";
import NavBarGeneral from "../../layout/NavBarGeneral";
import NavBarDark from "../../layout/NavBarDark";

const LandingPage = () => {
    const { t } = useTranslation();
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            // show navbar when user scrolls down a bit, hide at top
            setShowNav(window.scrollY > 20);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        // initialize
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const featureCardData = [
        {
            cardIcon: "feature1.png",
            cardTitle: t('landing.feature_tracking_title'),
            cardContent: t('landing.feature_tracking_content'),
        },
        {
            cardIcon: "feature2.png",
            cardTitle: t('landing.feature_interventions_title'),
            cardContent: t('landing.feature_interventions_content'),
        },
        {
            cardIcon: "feature3.png",
            cardTitle: t('landing.feature_analytics_title'),
            cardContent: t('landing.feature_analytics_content'),
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <div className={`landing-navbar ${showNav ? 'visible' : ''}`}>
                <NavBarGeneral />
            </div>

            <main className="flex-grow">
                <section className='landing-bg-section'>
                    <NavBarDark />
                    <div className='landing-session landing-top-session-padding justify-content-between align-items-center flex-column'>
                        <div className="align-content-center">
                            <h1 className="landing-white-title">
                                {t('landing.title')}
                            </h1>
                            <p className="landing-white-subtitle">
                                {t('landing.description')}
                            </p>
                        </div>
                        <div className="align-content-center" style={{ width: "90%", marginTop: '3em' }}>
                            <div className="emotion-card animate-transition">
                                <div className="card-header">
                                    <h3 className="black">{t('landing.today_emotions')}</h3>
                                    <span className="grey">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="emotion-bars">
                                    <div className="bar-group"><div className="bar happy"></div><span>{t('landing.happy')}</span></div>
                                    <div className="bar-group"><div className="bar sad"></div><span>{t('landing.sad')}</span></div>
                                    <div className="bar-group"><div className="bar fear"></div><span>{t('landing.fear')}</span></div>
                                    <div className="bar-group"><div className="bar anger"></div><span>{t('landing.anger')}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='landing-session flex-column' style={{ gap: '2em' }}>
                    <p className='landing-title align-self-center text-center'>{t('landing.about')}</p>
                    <div className='features-grid'>
                        <div className="feature-card grey-border">
                            <img
                                src="/Images/icon_watch.png"
                                alt="Watch"
                                height="50"
                                width="50"
                            />
                            <div className="column-center gap-2">
                                <p className='landing-title-small'>{t('landing.smartwatch_sensors')}</p>
                                <p className='landing-content-small'>{t('landing.smartwatch_desc')}</p>
                            </div>
                        </div>
                        <div className="feature-card grey-border">
                            <img
                                src="/Images/icon_cam.png"
                                alt="Camera"
                                height="50"
                                width="50"
                            />
                            <div className="column-center gap-2">
                                <p className='landing-title-small'>{t('landing.camera')}</p>
                                <p className='landing-content-small'>{t('landing.camera_desc')}</p>
                            </div>
                        </div>
                        <div className="feature-card grey-border">
                            <img
                                src="/Images/icon_mic.png"
                                alt="Mic"
                                height="50"
                                width="50"
                            />
                            <div className="column-center gap-2">
                                <p className='landing-title-small'>{t('landing.mic')}</p>
                                <p className='landing-content-small'>{t('landing.mic_desc')}</p>
                            </div>
                        </div>
                    </div>
                    <p className='landing-content-grey text-center' dangerouslySetInnerHTML={{ __html: t('landing.about_bot_desc') }}>
                    </p>
                </section>

                <section className='landing-session flex-column' style={{ gap: '2em', background: '#F0F0F0' }}>
                    <p className='landing-title align-self-center text-center'>{t('landing.powerful_features')}</p>
                    <div className="features-grid mt-3">
                        {featureCardData.map((card, index) => (
                            <CardFeature
                                key={index}
                                cardIcon={card.cardIcon}
                                cardTitle={card.cardTitle}
                                cardContent={card.cardContent}
                            />
                        ))}
                    </div>
                    <p className='landing-content-grey text-center'>
                        {t('landing.features_footer')}
                    </p>
                </section>

                <section className="landing-session flex-column" style={{ gap: '2em' }}>
                    <p className='landing-title align-self-center text-center'>{t('landing.how_it_works')}</p>
                    <p className='landing-content-grey text-center'>
                        {t('landing.how_it_works_desc')}
                    </p>
                    <div className="timeline mt-3">
                        <div className="timeline-step">
                            <div className="step-circle">1</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">{t('landing.step1_title')}</h3>
                                <p className="landing-content-small">
                                    {t('landing.step1_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">2</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">{t('landing.step2_title')}</h3>
                                <p className="landing-content-small">
                                    {t('landing.step2_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">3</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">{t('landing.step3_title')}</h3>
                                <p className="landing-content-small">
                                    {t('landing.step3_desc')}
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">4</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">{t('landing.step4_title')}</h3>
                                <p className="landing-content-small">
                                    {t('landing.step4_desc')}
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
                {/* <FitbitLoginButton /> */}
            </main>

            {/* <Footer /> */}
        </div>
    );
};

export default LandingPage;