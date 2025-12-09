import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import MiniCalendar from "../../dashboard/calendar/MiniCalendar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";

import TodayEmotionWordCloud from "../../components/TodayEmotionWordCloud";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";

import DisplayWidgets from "../../components/DisplayWidgets"

import '../../styles/dashboardPage.css';

const MainDashboardPage = () => {

	return (
		<div className="main-container">
			<div className="mb-8">
				<h1 className="page-title">
					Main Dashboard
				</h1>
				<p className="page-subtitle">
					Track and analyze your emotional patterns and interactions with Well-Bot
				</p>
			</div>

			<div className="dashboard-flex-row ">
				<DisplayWidgets />
				{/* <TodayEmotionWordCloud /> */}
			</div>

			{/* Charts */}

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-3">
				<EmotionalScore />
				<EmotionalDistribution />
			</div>

			{/* Tables & Charts */}

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 mt-3">
				{/* Check Table */}
				<RecentActivitiesTable />

				<PieChartCard />

				<DailyTraffic />

				{/* Complex Table , Task & Calendar */}
				{/* 
				<RecentActivitiesTable
					columnsData={columnsDataComplex}
					tableData={tableDataComplex}
				/> */}

				{/* Task chart & Calendar */}

				{/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
					<TaskCard />
					<div className="grid grid-cols-1 rounded-[20px]">
						<MiniCalendar />
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default MainDashboardPage;