import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarToday } from "react-icons/md";

// Import components
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";

const ActivityDashboardPage = () => {
    // Default to the last 30 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="main-container">
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="page-title">
                        Activity Dashboard
                    </h1>
                    <p className="page-subtitle">
                        Explore how your daily activities and moods evolve
                    </p>
                </div>

                {/* Global Date Picker */}
                <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
                    <MdOutlineCalendarToday className="ml-3 text-gray-600" />
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
                        className="bg-transparent text-sm font-medium text-gray-600 outline-none w-[210px] pl-2"
                        dateFormat="dd MMM yyyy"
                        placeholderText="Select Date Range"
                    />
                </div>
            </div>

            {/* Top Row: Charts */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-3">
                <div className="md:col-span-2">
                    <DailyTraffic startDate={startDate} endDate={endDate} />
                </div>
                <div className="md:col-span-1">
                    <PieChartCard startDate={startDate} endDate={endDate} />
                </div>
            </div>

            {/* Bottom Row: Full Table */}
            <div className="grid grid-cols-1">
                <RecentActivitiesTable startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default ActivityDashboardPage;