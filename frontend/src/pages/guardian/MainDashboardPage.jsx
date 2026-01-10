import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import FloatingNavbar from "../../layout/FloatingNavbar";

// Components
import DisplayWidgets from "../../components/DisplayWidgets";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
import NoMonitoredUser from "../../components/NoMonitoredUser";
import { AiOutlineLoading } from "react-icons/ai";

const MainDashboardPage = () => {
    const guardianId = getIdFromToken();

    const [wards, setWards] = useState([]);
    const [selectedWardId, setSelectedWardId] = useState("");
    const [loadingWards, setLoadingWards] = useState(true);
    const [embeddings, setEmbeddings] = useState([]);
    const [loadingEmbeddings, setLoadingEmbeddings] = useState(false);

    // Unified Date State
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());

    // Fetch Embeddings when Ward Changes
    useEffect(() => {
        const fetchEmbeddings = async () => {
            if (!selectedWardId) {
                setEmbeddings([]);
                return;
            }
            setLoadingEmbeddings(true);
            try {
                const token = localStorage.getItem('token');
                let url = `/api/embedding/${selectedWardId}`;
                if (startDate && endDate) {
                    const s = startDate.toISOString().split('T')[0];
                    const e = endDate.toISOString().split('T')[0];
                    url += `?startDate=${s}&endDate=${e}`;
                }

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmbeddings(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch embeddings", err);
                setEmbeddings([]);
            } finally {
                setLoadingEmbeddings(false);
            }
        };
        fetchEmbeddings();
    }, [selectedWardId, startDate, endDate]);

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

    if (loadingWards) {
        return <div className="flex h-[90vh] items-center justify-center">
            <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
        </div>;
    }

    return (
        <div className="main-container">
            <FloatingNavbar
                brandText="Main Dashboard"
                showUserFilter={true}
                wards={wards}
                selectedWardId={selectedWardId}
                onUserChange={setSelectedWardId}
            />

            {selectedWardId ? (
                <>
                    <div className="mt-4">
                        <h4 className="pl-4 text-lg font-bold text-navy-700">Today's Emotion Count</h4>
                        <DisplayWidgets userId={selectedWardId} />
                    </div>

                    <div className="mt-3">
                        <EmbeddingVisualizer
                            rawEmbeddings={embeddings}
                            height="350px"
                            loading={loadingEmbeddings}
                            onDateChange={(start, end) => {
                                setStartDate(start);
                                setEndDate(end);
                            }}
                        />
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
                    !loadingWards && (
                        <NoMonitoredUser />
                    )
                )
            )}
        </div>
    );
};

export default MainDashboardPage;