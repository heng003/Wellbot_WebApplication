import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import DisplayWidgets from "../../components/DisplayWidgets"
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
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

			<div>
				{/* <div className="flex justify-between pl-4">
					<HoverTooltip content="Overview of today's emotions">
						<h4 className="text-lg font-bold text-navy-700">Today Emotions</h4>
					</HoverTooltip>
					<InfoTooltip
						placement="top-right"
						content={
							<span>
								Summary of today's emotion counts<br />
								<span className="font-bold">Note:</span> Percentages are based on total emotion logs.
							</span>
						}
					/>
				</div> */}
				<h4 className="pl-4 text-lg font-bold text-navy-700">Today's Emotion Count</h4>
				<DisplayWidgets />
			</div>

			{/* Charts */}

			<div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-3">
				<EmotionalScore />
				<EmotionalDistribution />
			</div>

			{/* Tables */}
			<div className="mt-3">
				<RecentActivitiesTable />
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
				<DailyTraffic />

				<PieChartCard />
			</div>

			<div className="mt-3">
				<MoodActivityCorrelation />
			</div>
		</div>
	);
};

export default MainDashboardPage;