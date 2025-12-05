import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import MiniCalendar from "../../dashboard/calendar/MiniCalendar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";

import Widget from "../../dashboard/widget/Widget";
import TodayEmotionWordCloud from "../../components/TodayEmotionWordCloud";
import CheckTable from "../../dashboard/default/CheckTable";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";

// import Swal from 'sweetalert2';
// import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';

const InterventionDashboardPage = () => {
    const token = localStorage.getItem('token');
    const userId = getIdFromToken();
    // const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());

    return (
        <div className="main-container">
            <div className="mb-8">
                <h1 className="page-title">
                    Emotional Dashboard
                </h1>
                <p className="page-subtitle">
                    Track and analyze your emotional patterns
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mt-3">
                <DailyTraffic />

                <RecentActivitiesTable />

                <PieChartCard />
            </div>
        </div>
    );
};

export default InterventionDashboardPage;