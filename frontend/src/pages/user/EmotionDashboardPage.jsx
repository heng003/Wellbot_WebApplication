import React, { useState } from "react";
import FloatingNavbar from "../../layout/FloatingNavbar";

// Import your modularized components
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalTable from "../../dashboard/default/EmotionalTable";
import HoverTooltip from "../../components/HoverTooltip";

const EmotionalDashboardPage = () => {
    // Default to the last 15 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 14)));
    const [endDate, setEndDate] = useState(new Date());

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
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-3 mt-3 lg:grid-cols-2">
                <EmotionalScore startDate={startDate} endDate={endDate} />
                <EmotionalDistribution startDate={startDate} endDate={endDate} />
            </div>

            {/* Table Row */}
            <div className="grid grid-cols-1 gap-3 mt-3">
                <EmotionalTable startDate={startDate} endDate={endDate} />
            </div>
        </div >
    );
};

export default EmotionalDashboardPage;