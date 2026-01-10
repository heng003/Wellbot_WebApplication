import React, { useState, useEffect } from "react";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";
import { useSocketSubscription } from "../../hooks/useSocket";
import FloatingNavbar from "../../layout/FloatingNavbar";

// Components
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import MessagePatternInsights from "../../components/MessagePatternInsights";
import NoMonitoredUser from "../../components/NoMonitoredUser";
import { AiOutlineLoading } from "react-icons/ai";

const ChatMapDashboardPage = () => {
    const guardianId = getIdFromToken();

    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState("");
    const [loadingWards, setLoadingWards] = useState(true);

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [embeddings, setEmbeddings] = useState([]);
    const [loadingWords, setLoadingWords] = useState(false);

    // Fetch Wards on Mount
    useEffect(() => {
        const loadWards = async () => {
            try {
                const data = await fetchActiveWards(guardianId);
                setWards(data || []);
                setWards(data || []);
                // Default selection removed to let guardian select deliberately
            } catch (error) {
                console.error("Failed to fetch wards", error);
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [guardianId]);

    const loadEmbeddings = React.useCallback(async () => {
        if (!selectedWardId) return;
        setLoadingWords(true);
        try {
            const data = await fetchUserEmbeddings(selectedWardId, startDate, endDate);
            setEmbeddings(data || []);
        } catch (error) {
            console.error("Failed to fetch embeddings", error);
        } finally {
            setLoadingWords(false);
        }
    }, [selectedWardId, startDate, endDate]);

    useEffect(() => {
        loadEmbeddings();
    }, [loadEmbeddings]);

    useSocketSubscription(['wb_embeddings'], loadEmbeddings);

    if (loadingWards) {
        return <div className="flex h-[90vh] items-center justify-center">
            <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
        </div>;
    }

    return (
        <div className="main-container">
            <FloatingNavbar
                brandText="ChatMap Dashboard"
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                }}
                showUserFilter={true}
                wards={wards}
                selectedWardId={selectedWardId}
                onUserChange={setSelectedWardId}
            />

            {selectedWardId ? (
                <>
                    <div className="mt-2">
                        <EmbeddingVisualizer rawEmbeddings={embeddings} loading={loadingWords} />
                    </div>
                    <div className="mt-3">
                        <MessagePatternInsights rawEmbeddings={embeddings} loading={loadingWords} />
                    </div>
                </>
            ) : (
                !loadingWards && (
                    <NoMonitoredUser />
                )
            )}
        </div>
    );
};

export default ChatMapDashboardPage;