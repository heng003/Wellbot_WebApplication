import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";

// Components
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import MessagePatternInsights from "../../components/MessagePatternInsights";
import HoverTooltip from "../../components/HoverTooltip";

// Icon
import { MdOutlineCalendarToday } from "react-icons/md";

const ChatMapDashboardPage = () => {
    const userId = getIdFromToken();

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [embeddings, setEmbeddings] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const loadEmbeddings = async () => {
            try {
                const data = await fetchUserEmbeddings(userId, startDate, endDate);
                setEmbeddings(data || []);
            } catch (error) {
                console.error("Failed to fetch embeddings", error);
            }
        };
        loadEmbeddings();
    }, [userId, startDate, endDate]);

    return (
        <div className="main-container">
            <div className="header-section">
                <div>
                    <h1 className="page-title">ChatMap Dashboard</h1>
                    <p className="page-subtitle">Analyze communication habits, identifying emotional triggers, recurring patterns, and message diversity trends.</p>
                </div>
                <div className="flex px-1 py-3 items-center gap-3 rounded-xl bg-white shadow-sm">
                    <HoverTooltip content="Select custom date range for overall dashboard">
                        <MdOutlineCalendarToday className="ml-3 text-gray-700" />
                    </HoverTooltip>
                    <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        className="bg-transparent text-sm font-medium outline-none w-[200px] text-gray-700"
                        dateFormat="dd MMM yyyy"
                        placeholderText="Select Date Range"
                    />
                </div>
            </div>

            <div className="mt-2">
                <EmbeddingVisualizer rawEmbeddings={embeddings} />
            </div>

            <div className="mt-3">
                <MessagePatternInsights rawEmbeddings={embeddings} />
            </div>
        </div>
    );
};

export default ChatMapDashboardPage;