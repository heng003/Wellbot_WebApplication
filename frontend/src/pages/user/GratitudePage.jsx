import React, { useState, useEffect } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
import { MdAdd } from 'react-icons/md';
import { fetchGratitudes } from '../../services/gratitudeService';
import { getIdFromToken } from '../../utils/auth';
import GratitudeCard from '../../dashboard/card/GratitudeCard';
import GratitudeModal from '../../components/GratitudeModal';
import MyFavGratitudeList from '../../components/MyFavGratitudeList';
import { useSocketSubscription } from '../../hooks/useSocket';
import FloatingNavbar from '../../layout/FloatingNavbar';

const GratitudePage = () => {
    const [gratitudes, setGratitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const userId = getIdFromToken();

    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchGratitudes(userId);
            // Sort by created_at desc (newest first)
            const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
            setGratitudes(sorted);
        } catch (err) {
            console.error('Failed to load gratitude items', err);
            setGratitudes([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useSocketSubscription(['wb_gratitude_item'], loadData);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const favs = gratitudes?.filter(j => j?.fav === true) || [];

    return (
        <div className="main-container-bg">
            <FloatingNavbar
                brandText="Moments of Gratitude"
                actionButton={{
                    label: "Add New Gratitude Item",
                    icon: <MdAdd className="h-6 w-6" />,
                    onClick: () => setShowAddModal(true)
                }}
            />

            {loading ? (
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <AiOutlineLoading className="h-12 w-12 animate-spin text-[#3E9389]" />
                </div>
            ) : gratitudes.length > 0 ? (
                <div className={`grid gap-4 ${favs.length > 0 ? "col-span-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "col-span-3 grid-cols-3"}`}>
                    {/* Loading State Handling */}

                    <div className="col-span-2 grid gap-4 grid-cols-2">
                        {gratitudes.map((item) => (
                            <GratitudeCard
                                key={item.id}
                                data={item}
                                onEdit={loadData}
                            />
                        ))}
                    </div>

                    {favs.length > 0 && (
                        <div className="col-span-1">
                            <MyFavGratitudeList favs={favs} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="col-span-full py-10 text-center text-gray-500">
                    <p>No gratitude item found. Start writing your first gratitude item!</p>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <GratitudeModal
                    onClose={() => setShowAddModal(false)}
                    onUpdate={loadData}
                />
            )}
        </div>
    );
};

export default GratitudePage;