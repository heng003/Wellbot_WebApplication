import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";

// Components
import Card from "../../dashboard/card";
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";

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
                    <p className="page-subtitle">Visualizing your conversation message, clustered by emotional</p>
                </div>
                <div className="flex px-1 py-3 items-center gap-3 rounded-xl bg-white shadow-sm">
                    <MdOutlineCalendarToday className="ml-3 text-gray-700" />
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

            <div className="mt-2 py-4">
                <Card extra="p-4">
                    <EmbeddingVisualizer rawEmbeddings={embeddings} />
                </Card>
            </div>
        </div>
    );
};

export default ChatMapDashboardPage;