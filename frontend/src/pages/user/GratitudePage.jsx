import React, { useState, useEffect } from 'react';
import J2 from "../../assets/journals/J2.png";
import J3 from "../../assets/journals/J3.png";
import J4 from "../../assets/journals/J4.png";
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import JournalCard from '../../dashboard/card/JournalCard';
import HistoryCard from '../../components/HistoryCard';

const GratitudePage = () => {

    return (
        <>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" style={{padding: "3em"}}>
                <div className="col-span-2">
                    <div className="top-bar header-section flex-column">
                        <div>
                            <h1 className="page-title">Moments of Gratitude</h1>
                            <p className="page-subtitle">Express appreciation for the people who matter</p>
                        </div>
                    </div>
                    <div className="z-20 grid gap-5 grid-cols-2 lg:grid-cols-3">
                        <JournalCard
                            title="Happy Day"
                            date="25 September 2025"
                            image={J2}
                        />
                        <JournalCard
                            title="Christmas Celebration"
                            date="26 September 2025"
                            image={J3}
                        />
                        <JournalCard
                            title="Sad Time"
                            date="27 September 2025"
                            image={J4}
                        />
                        <JournalCard
                            title="Christmas Celebration"
                            date="26 September 2025"
                            image={J3}
                        />
                        <JournalCard
                            title="Sad Time"
                            date="27 September 2025"
                            image={J4}
                        />
                    </div>
                </div>
                <div className="col-span-1">
                    <HistoryCard />
                </div>
            </main>
        </>
    );
};

export default GratitudePage;