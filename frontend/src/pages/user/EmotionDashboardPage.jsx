import React, { useState } from "react";
// Ensure you have react-datepicker installed: npm install react-datepicker
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
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="main-container">
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="page-title">
                        Emotional Dashboard
                    </h1>
                    <p className="page-subtitle">
                        Track and analyze your emotional patterns
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm dark:bg-navy-800">
                    <MdOutlineCalendarToday className="text-gray-600" />
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
                        className="bg-transparent text-sm font-medium text-gray-600 outline-none w-[200px]"
                        dateFormat="dd MMM yyyy"
                        placeholderText="Select Date Range"
                    />
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2">
                {/* Pass startDate and endDate to put components in "Controlled Mode".
                   They will hide their own date pickers and use these props.
                */}
                <EmotionalScore startDate={startDate} endDate={endDate} />
                <EmotionalDistribution startDate={startDate} endDate={endDate} />
            </div>

            {/* Table Row */}
            <div className="grid grid-cols-1 gap-3 mt-3">
                <EmotionalTable startDate={startDate} endDate={endDate} />
            </div>
        </div>
    );
};

export default EmotionalDashboardPage;