import React, { useState, useEffect } from 'react';
import '../../styles/journalPage.css';
import J1 from "../../assets/journals/J1.png";
import J2 from "../../assets/journals/J2.png";
import J3 from "../../assets/journals/J3.png";
import J4 from "../../assets/journals/J4.png";
import J5 from "../../assets/journals/J5.png";
import J6 from "../../assets/journals/J6.png";
import { fetchJournals } from '../../services/journalService';
import Swal from 'sweetalert2';
import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import JournalCard from '../../dashboard/card/JournalCard';
import MyFavCard from '../../components/MyFavCard';

const JournalPage = () => {

    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = getIdFromToken();
    const journalImages = [J1, J2, J3, J4, J5, J6];

    const load = async () => {
        try {
            setLoading(true);
            const data = await fetchJournals(userId);
            if (!Array.isArray(data)) {
                console.warn('No Existing Journal:', data);
            }

            setJournals(data);
        } catch (err) {
            console.error('Failed to load journals', err);
            setJournals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const favs = journals?.filter(j => j?.fav === true) || [];
    const others = journals;

    return (
        <>
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ padding: "3em" }}>
                <div className="col-span-2">
                    <div className="top-bar header-section flex-column">
                        <div>
                            <h1 className="page-title">Journal</h1>
                            <p className="page-subtitle">Capture your thoughts and memories</p>
                        </div>
                    </div>
                    <div className="z-20 grid gap-4 grid-cols-2 xl:grid-cols-3">
                        {journals.map((j, index) => (
                            <JournalCard
                                key={j.id}
                                id={j.id}
                                title={j.title}
                                content={j.body}
                                created_at={j.created_at}
                                fav={j.fav}
                                image={journalImages[index % journalImages.length]}
                                onEdit={load}
                            />
                        ))}
                    </div>
                </div>
                {favs.length > 0 && (
                    <div className="col-span-1">
                        <MyFavCard favs={favs} />
                    </div>
                )}
            </main>
        </>
    );
};

export default JournalPage;