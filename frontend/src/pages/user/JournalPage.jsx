import React, { useState, useEffect } from 'react';
import '../../styles/journalPage.css';
import J2 from "../../assets/journals/J2.png";
import J3 from "../../assets/journals/J3.png";
import J4 from "../../assets/journals/J4.png";
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import Card from '../../dashboard/card/JournalCard';

const JournalPage = () => {

    return (
        <>
            <main className="main-container">
                <div className="top-bar">
                    <div className="header-section flex-column">
                        <div>
                            <h1 className="page-title">Journal</h1>
                            <p className="page-subtitle">Capture your thoughts and memories</p>
                        </div>
                    </div>

                    <div className="z-20 grid gap-5 md:grid-cols-3">
                        <Card
                            title="Abstract Colors"
                            author="Esthera Jackson"
                            price="0.91"
                            image={J2}
                        />
                        <Card
                            title="ETH AI Brain"
                            author="Nick Wilson"
                            price="0.7"
                            image={J3}
                        />
                        <Card
                            title="Mesh Gradients"
                            author="Will Smith"
                            price="2.91"
                            image={J4}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default JournalPage;