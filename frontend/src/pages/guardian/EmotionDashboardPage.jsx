import React, { useState, useEffect } from "react";
import { fetchActiveWards } from "../../services/guardianDashboardService";
import { getIdFromToken } from "../../utils/auth";
import FloatingNavbar from "../../layout/FloatingNavbar";

// Components
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalTable from "../../dashboard/default/EmotionalTable";
import NoMonitoredUser from "../../components/NoMonitoredUser";
import { AiOutlineLoading } from "react-icons/ai";

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
                brandText="Emotional Dashboard"
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
                    <NoMonitoredUser />
                )
            )}
        </div>
    );
};

export default EmotionDashboardPage;