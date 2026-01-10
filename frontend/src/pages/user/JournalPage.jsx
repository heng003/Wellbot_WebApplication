import React, { useState, useEffect } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
import '../../styles/journalPage.css';
import J1 from "../../assets/journals/J1.png";
import J2 from "../../assets/journals/J2.png";
import J3 from "../../assets/journals/J3.png";
import J4 from "../../assets/journals/J4.png";
import J5 from "../../assets/journals/J5.png";
import J6 from "../../assets/journals/J6.png";
import { fetchJournals } from '../../services/journalService';
import { getIdFromToken } from '../../utils/auth';
import JournalCard from '../../dashboard/card/JournalCard';
import MyFavJournalList from '../../components/MyFavJournalList';
import { MdAdd } from 'react-icons/md';
import JournalModal from '../../components/JournalModal';
import FloatingNavbar from '../../layout/FloatingNavbar';

import { useSocketSubscription } from '../../hooks/useSocket';

const JournalPage = () => {

    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = getIdFromToken();
    const journalImages = [J1, J2, J3, J4, J5, J6];
    const [showAddModal, setShowAddModal] = useState(false);

    const load = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchJournals(userId);

            if (!Array.isArray(data)) {
                console.warn('No Existing Journal:', data);
                setJournals([]);
            } else {
                setJournals(data);
            }

            // Preload images to ensure they are ready
            await Promise.all(journalImages.map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = src;
                });
            }));

        } catch (err) {
            console.error('Failed to load journals', err);
            setJournals([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useSocketSubscription(['wb_journal'], load);

    useEffect(() => {
        load();
    }, [load]);

    const favs = journals?.filter(j => j?.fav === true) || [];

    return (
        <>
            <main className="main-container-bg">
                <FloatingNavbar
                    brandText="Journal"
                    actionButton={{
                        label: "Add New Journal",
                        icon: <MdAdd className="h-6 w-6" />,
                        onClick: () => setShowAddModal(true)
                    }}
                />
                {loading ? (
                    <div className="flex h-[50vh] w-full items-center justify-center">
                        <AiOutlineLoading className="h-12 w-12 animate-spin text-[#3E9389]" />
                    </div>
                ) : journals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Loading State Handling */}

                        <div className={`grid gap-4 ${favs.length > 0 ? "col-span-2 grid-cols-2 xl:grid-cols-3" : "col-span-3 grid-cols-4"}`} >
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

                        {favs.length > 0 && (
                            <div className="col-span-1">
                                <MyFavJournalList favs={favs} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                        <p>No journals found. Start writing your first memory!</p>
                    </div>
                )}
            </main>
            {showAddModal && (
                <JournalModal
                    initialData={null}
                    image={journalImages[Math.floor(Math.random() * journalImages.length)]}
                    onClose={() => setShowAddModal(false)}
                    onUpdate={load}
                    openInitially={true}
                />

            )}
        </>
    );
};

export default JournalPage;