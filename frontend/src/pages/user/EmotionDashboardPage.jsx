import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineCalendarToday } from "react-icons/md";

// Import your modularized components
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalTable from "../../dashboard/default/EmotionalTable";
// import ComplexTable from "../default/components/ComplexTable"; 

const EmotionalDashboardPage = () => {
    // Default to the last 30 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 15)));
    const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="main-container">
            <div className="header-section">
                <div>
                    <h1 className="page-title">Emotional Dashboard</h1>
                    <p className="page-subtitle">Track and analyze your emotional patterns</p>
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

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-3 mt-3 lg:grid-cols-2">
                <EmotionalScore startDate={startDate} endDate={endDate} />
                <EmotionalDistribution startDate={startDate} endDate={endDate} />
            </div>

            {/* Table Row */}
            <div className="grid grid-cols-1 gap-3 mt-3 pb-10">
                <EmotionalTable startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default EmotionalDashboardPage;