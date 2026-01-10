import React, { useState } from "react";
// Import components
import FloatingNavbar from "../../layout/FloatingNavbar";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
import HoverTooltip from "../../components/HoverTooltip";

const ActivityDashboardPage = () => {
    // Default to the last 30 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14)));
    const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="main-container">
            <FloatingNavbar
                brandText="Activity Dashboard"
                startDate={startDate}
                endDate={endDate}
                onDateChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                }}
            />

            {/* Top Row: Charts */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-3 mb-3">
                <DailyTraffic startDate={startDate} endDate={endDate} />
                <PieChartCard startDate={startDate} endDate={endDate} />
            </div>

            {/* Bottom Row: Full Table */}
            <div className="grid grid-cols-1">
                <RecentActivitiesTable startDate={startDate} endDate={endDate} />
            </div>

            <div className="grid grid-cols-1 gap-3 mt-3">
                <MoodActivityCorrelation startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default ActivityDashboardPage;