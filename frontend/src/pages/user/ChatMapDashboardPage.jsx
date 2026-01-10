import React, { useState, useEffect } from "react";
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";
import { useSocketSubscription } from "../../hooks/useSocket";

// Components
import FloatingNavbar from "../../layout/FloatingNavbar";
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import MessagePatternInsights from "../../components/MessagePatternInsights";

const ChatMapDashboardPage = () => {
    const userId = getIdFromToken();

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [embeddings, setEmbeddings] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadEmbeddings = React.useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await fetchUserEmbeddings(userId, startDate, endDate);
            setEmbeddings(data || []);
        } catch (error) {
            console.error("Failed to fetch embeddings", error);
        } finally {
            setLoading(false);
        }
    }, [userId, startDate, endDate]);

    useEffect(() => {
        loadEmbeddings();
    }, [loadEmbeddings]);

    useSocketSubscription(['wb_embeddings'], loadEmbeddings);

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
            />

            <div className="mt-2">
                <EmbeddingVisualizer rawEmbeddings={embeddings} loading={loading} />
            </div>

            <div className="mt-3">
                <MessagePatternInsights rawEmbeddings={embeddings} loading={loading} />
            </div>
        </div>
    );
};

export default ChatMapDashboardPage;