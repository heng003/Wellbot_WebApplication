import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarToday } from "react-icons/md";

// Import components
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
            <div className="header-section">
                <div>
                    <h1 className="page-title">Activity Dashboard</h1>
                    <p className="page-subtitle">Explore how your daily activities and moods evolve</p>
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