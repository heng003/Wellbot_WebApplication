import React, { useState, useEffect } from "react";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFileDownload, MdOutlineCalendarToday } from "react-icons/md";

// Components
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalTable from "../../dashboard/default/EmotionalTable";

const EmotionDashboardPage = () => {
    const guardianId = getIdFromToken();

    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState("");
    const [loadingWards, setLoadingWards] = useState(true);

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14)));
    const [endDate, setEndDate] = useState(new Date());

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

    return (
        <div className="main-container">
            <div className="header-section">
                <div>
                    <h1 className="page-title">Emotional Dashboard</h1>
                    <p className="page-subtitle">Monitor the emotional patterns of your connected users</p>
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
                    <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2">
                        <EmotionalScore userId={selectedWardId} startDate={startDate} endDate={endDate} />
                        <EmotionalDistribution userId={selectedWardId} startDate={startDate} endDate={endDate} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-3">
                        <EmotionalTable userId={selectedWardId} startDate={startDate} endDate={endDate} />
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

export default EmotionDashboardPage;