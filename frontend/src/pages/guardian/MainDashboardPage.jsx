import React, { useState, useEffect } from "react";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";

// Components
import DisplayWidgets from "../../components/DisplayWidgets";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";

const MainDashboardPage = () => {
    const guardianId = getIdFromToken();

    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState("");
    const [loadingWards, setLoadingWards] = useState(true);

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
            <div>
                <div className="flex justify-between">
                    <div>
                        <h1 className="page-title">
                            Main Dashboard
                        </h1>
                        <p className="page-subtitle">
                            Monitor the well-being of your connected users.
                        </p>
                    </div>

                </div>
                {/* User Selector */}
                <div className="mt-4 md:mt-0">
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
            </div>

            {selectedWardId ? (
                <>
                    <div className="mt-4">
                        <h4 className="pl-4 text-lg font-bold text-navy-700">Today's Emotion Count</h4>
                        <DisplayWidgets userId={selectedWardId} />
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-3">
                        <EmotionalScore userId={selectedWardId} />
                        <EmotionalDistribution userId={selectedWardId} />
                    </div>

                    <div className="mt-3">
                        <RecentActivitiesTable userId={selectedWardId} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
                        <DailyTraffic userId={selectedWardId} />
                        <PieChartCard userId={selectedWardId} />
                    </div>

                    <div className="mt-3">
                        <MoodActivityCorrelation userId={selectedWardId} />
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

export default MainDashboardPage;