import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { fetchUserEmbeddings } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";

// Components
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import MessagePatternInsights from "../../components/MessagePatternInsights";
import HoverTooltip from "../../components/HoverTooltip";

// Icon
import { MdOutlineCalendarToday } from "react-icons/md";

const ChatMapDashboardPage = () => {
    const guardianId = getIdFromToken();

    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState("");
    const [loadingWards, setLoadingWards] = useState(true);

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [embeddings, setEmbeddings] = useState([]);

    // Fetch Wards on Mount
    useEffect(() => {
        const loadWards = async () => {
            try {
                const data = await fetchActiveWards(guardianId);
                setWards(data || []);
                if (data && data.length > 0) {
                    setSelectedWardId(data[0].id); // Default to first ward
                }
            } catch (error) {
                console.error("Failed to fetch wards", error);
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [guardianId]);

    useEffect(() => {
        if (!selectedWardId) return;
        const loadEmbeddings = async () => {
            try {
                const data = await fetchUserEmbeddings(selectedWardId, startDate, endDate);
                setEmbeddings(data || []);
            } catch (error) {
                console.error("Failed to fetch embeddings", error);
            }
        };
        loadEmbeddings();
    }, [selectedWardId, startDate, endDate]);

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
                        maxDate={new Date()}
                        className="bg-transparent text-sm font-medium outline-none w-[200px] text-gray-700"
                        dateFormat="dd MMM yyyy"
                        placeholderText="Select Date Range"
                    />
                </div>
            </div>

            {/* User Selector */}
            <div className="mt-4 mb-2 md:mt-0">
                {loadingWards ? (
                    <p className="text-sm text-gray-500">Loading users...</p>
                ) : wards.length > 0 ? (
                    <div>
                        <h6>Select User for Insights</h6>
                        <select
                            className="block w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500"
                            value={selectedWardId}
                            onChange={(e) => setSelectedWardId(e.target.value)}
                        >
                            {wards.map((ward) => (
                                <option key={ward.id} value={ward.id}>
                                    {ward.full_name || ward.email}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <p className="text-sm text-red-500">No active monitored user found.</p>
                )}
            </div>

            {selectedWardId ? (
                <>
                    <div className="mt-2">
                        <EmbeddingVisualizer rawEmbeddings={embeddings} />
                    </div>
                    <div className="mt-3">
                        <MessagePatternInsights rawEmbeddings={embeddings} />
                    </div>
                </>
            ) : (
                !loadingWards && (
                    <div className="flex h-[50vh] items-center justify-center text-gray-500">
                        Select a user to view their dashboard.
                    </div>
                )
            )}
        </div>
    );
};

export default ChatMapDashboardPage;