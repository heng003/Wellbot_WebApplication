import React, { useState, useEffect } from "react";
import CardFeature from "../../components/CardFeature";
import "../../styles/landingPage.css";

import { Link } from 'react-router-dom';//remove

const LandingPage = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const featureCardData = [
        {
            cardIcon: "feature1.png",
            cardTitle: "Real-Time Emotion Tracking",
            cardContent: "Monitor your emotional states in real-time through our advanced detection systems, including camera, wearable devices, and voice analysis.",
        },
        {
            cardIcon: "feature2.png",
            cardTitle: "Wellness Interventions",
            cardContent: "Receive timely support and interventions when negative emotional states are detected, helping you regain emotional balance.",
        },
        {
            cardIcon: "feature3.png",
            cardTitle: "Detailed Analytics",
            cardContent: "Gain insights into your emotional patterns with comprehensive charts, graphs, and historical data to identify trends.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* <Header /> */}


            <main className="flex-grow">
                <button><Link to="/guardian/monitoredUser" className="navbar-logo-container text-decoration-none">
                    <img
                        src="/Images/logo.png"
                        alt="Logo"
                        height="60"
                    />
                    <span className="nav-title">click</span>
                </Link></button>
                <button><Link to="/user/trackingManage" className="navbar-logo-container text-decoration-none">
                    <img
                        src="/Images/logo.png"
                        alt="Logo"
                        height="60"
                    />
                    <span className="nav-title">click</span>
                </Link></button>
                <section className='landing-session landing-bg-section justify-content-between align-items-center'>
                    <div className="landing-grid">
                        <div className="align-content-center">
                            <h1 className="landing-white-title">
                                Enhance Your Emotional Wellness with Well-Bot
                            </h1>
                            <p className="landing-white-subtitle">
                                Track, understand, and improve your emotional well-being with our cutting-edge wellness insight system.
                            </p>
                        </div>
                        {!isMobile && <div>
                            <div className="emotion-card animate-transition">
                                <div className="card-header">
                                    <h3 className="black">Today's Emotions</h3>
                                    <span className="grey">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="emotion-bars">
                                    <div className="bar-group"><div className="bar happy"></div><span>Happy</span></div>
                                    <div className="bar-group"><div className="bar sad"></div><span>Sad</span></div>
                                    <div className="bar-group"><div className="bar fear"></div><span>Fear</span></div>
                                    <div className="bar-group"><div className="bar anger"></div><span>Anger</span></div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </section>

                <section className='landing-session flex-column' style={{ gap: '2em' }}>
                    <p className='landing-title align-self-center text-center'>About</p>
                    <p className='landing-content-grey text-center'>
                        Well-Bot, a smart companion droid designed to provide early intervention when detecting critical emotional states such as sadness, fear, or anger. By combining multimodal emotion analysis, Well-Bot Insight delivers a holistic view of the user’s emotional state through:
                    </p>
                    <div className='features-grid'>
                        <div className="feature-card">
                            <img
                                src="/Images/watch.png"
                                alt="Watch"
                                height="50"
                                width="50"
                            />
                            <p className='landing-title-small'>Smartwatch Sensors</p>
                            <p className='landing-content-small'>To Monitor Real-Time Body Vital Signs</p>
                        </div>
                        <div className="feature-card">
                            <img
                                src="/Images/camera.png"
                                alt="Camera"
                                height="50"
                                width="50"
                            />
                            <p className='landing-title-small'>Well-Bot Camera</p>
                            <p className='landing-content-small'>To Capture Facial Expressions</p>
                        </div>
                        <div className="feature-card">
                            <img
                                src="/Images/mic.png"
                                alt="Mic"
                                height="50"
                                width="42"
                                style={{ paddingBlock: '8.33px' }}
                            />
                            <p className='landing-title-small'>Well-Bot Microphone</p>
                            <p className='landing-content-small'>To Capture Speech and Background Musics</p>
                        </div>
                    </div>
                    <p className='landing-content-grey text-center'>
                        With the power of AI and real-time data collection, Well-Bot delivers personalized early intervention on user’s mental wellness and  offer insight into their emotional states, helping users stay aware of their mental well-being and promoting healthier emotional regulation.
                    </p>
                </section>

                <section className='landing-session flex-column' style={{ gap: '2em', background: '#F0F0F0' }}>
                    <p className='landing-title align-self-center text-center'>Powerful Features for Emotional Well-being</p>
                    <p className='landing-content-grey text-center'>
                        Our system provides you with the tools you need to understand, track, and improve your emotional wellness.
                    </p>
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
                        With the power of AI and real-time data collection, Well-Bot delivers personalized early intervention on user’s mental wellness and  offer insight into their emotional states, helping users stay aware of their mental well-being and promoting healthier emotional regulation.
                    </p>
                </section>

                <section className="landing-session flex-column" style={{ gap: '2em' }}>
                    <p className='landing-title align-self-center text-center'>How Well-Bot Works</p>
                    <p className='landing-content-grey text-center'>
                        Our system uses advanced technology to provide you with personalized early mental support and emotional insights.
                    </p>
                    <div className="timeline mt-3">
                        <div className="timeline-step">
                            <div className="step-circle">1</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">Activate Your Well-Bot Droid</h3>
                                <p className="landing-content-small">
                                    Activate your Well-Bot Droid By Register a new account in our website for comprehensive emotional detection.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">2</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">Real-Time Emotion Detection</h3>
                                <p className="landing-content-small">
                                    Our AI algorithms analyze your expressions, physiological responses, voice patterns, and Background Music to identify emotional states.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">3</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">Personalized Early Intervention</h3>
                                <p className="landing-content-small">
                                    Receive Mental Support through Wellbot Droid customized when you are Under Critical Emotional State.
                                </p>
                            </div>
                        </div>

                        <div className="timeline-step">
                            <div className="step-circle">4</div>
                            <div className="timeline-card timeline-card-left">
                                <h3 className="landing-title-small">Data Analysis & Visualization</h3>
                                <p className="landing-content-small">
                                    Your Emotional Data is processed and presented in easy-to-understand charts and trends on your Personal Dashboard.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

            </main>

            {/* <Footer /> */}
        </div>
    );
};

export default LandingPage;