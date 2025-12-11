import React, { useState, useEffect } from "react";
import { fetchActiveWards } from "../../services/guardianPermissionService";
import { getIdFromToken } from "../../utils/auth";

// Components
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import Widget from "../../dashboard/widget/Widget";
import { useEmotions } from "../../hooks/useEmotions";

// Icons
import HappyIcon from "../../icons/HappyIcon";
import SadIcon from "../../icons/SadIcon";
import AngryIcon from "../../icons/AngryIcon";
import FearIcon from "../../icons/FearIcon";

const emotionConfig = {
    Happy: { icon: <HappyIcon /> },
    Sad: { icon: <SadIcon /> },
    Angry: { icon: <AngryIcon /> },
    Fear: { icon: <FearIcon /> },
};

const MainDashboardPage = () => {
    const guardianId = getIdFromToken();
    const token = localStorage.getItem('token');

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

    // Fetch Emotion Widgets Data for Selected Ward
    // Note: You must ensure useEmotions accepts userId as 2nd arg
    const today = new Date().toISOString().slice(0, 10);
    const { emotions } = useEmotions(token, selectedWardId, today, today);

    return (
        <div className="main-container">
            <div className="mb-8">
                <div className="flex justify-between">
                    <div>
                        <h1 className="page-title">
                            Main Dashboard
                        </h1>
                        <p className="page-subtitle">
                            Monitor the well-being of your connected users.
                        </p>
                    </div>
                    <div className="flex">
                        <button className="green-button">Generate Report</button>
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
                                        {ward.name || ward.email}
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
                    {/* Widgets Row */}
                    <div className="dashboard-widget-grid mb-5">
                        {emotions && emotions.map((e) => {
                            const config = emotionConfig[e.emotion_label] || {};
                            return (
                                <Widget
                                    key={e.emotion_label}
                                    icon={config.icon}
                                    title={e.emotion_label}
                                    subtitle={e.count}
                                    trendValue={`${(e.avg_confidence * 100).toFixed(1)}%`}
                                />
                            );
                        })}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <EmotionalScore userId={selectedWardId} />
                        <EmotionalDistribution userId={selectedWardId} />
                    </div>

                    {/* Complex Data Row */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mt-3">
                        <RecentActivitiesTable userId={selectedWardId} />
                        <DailyTraffic userId={selectedWardId} />
                        <PieChartCard userId={selectedWardId} />
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