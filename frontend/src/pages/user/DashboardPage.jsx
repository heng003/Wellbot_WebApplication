import React from "react";
import '../../styles/dashboardPage.css';
import MiniCalendar from "../../dashboard/calendar/MiniCalendar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";

import { columnsDataCheck, columnsDataComplex } from "../../dashboard/variables/columnsData";

import Widget from "../../dashboard/widget/Widget";
import TodayEmotionWordCloud from "../../components/TodayEmotionWordCloud";
import CheckTable from "../../dashboard/default/CheckTable";
import ComplexTable from "../../dashboard/default/ComplexTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import TaskCard from "../../dashboard/default/TaskCard";
import tableDataCheck from "../../dashboard/variables/tableDataCheck.json";
import tableDataComplex from "../../dashboard/variables/tableDataComplex.json";

const DashboardPage = () => {
	return (
		<div className="main-container">
			{/* Card widget and word cloud responsive layout */}

			<div className="dashboard-flex-row ">
				<div className="dashboard-widget-grid">
					<Widget
						icon={
							<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="10" fill="#0D9488" />
								<path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#DCFCE7" strokeWidth="1.5" fill="none" />
								<circle cx="9" cy="10" r="1" fill="#DCFCE7" />
								<circle cx="15" cy="10" r="1" fill="#DCFCE7" />
							</svg>
						}
						title={"Happy"}
						subtitle={"30"}
						trend="up"
						trendValue={"+2.45%"}
					/>
					<Widget
						icon={
							<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="10" fill="#2563EB" />
								<path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="#DBEAFE" strokeWidth="1.5" fill="none" />
								<circle cx="9" cy="10" r="1" fill="#DBEAFE" />
								<circle cx="15" cy="10" r="1" fill="#DBEAFE" />
							</svg>
						}
						title={"Sad"}
						subtitle={"5"}
						trend="down"
						trendValue={"-1.20%"}
					/>
					<Widget
						icon={
							<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="10" fill="#EAB308" />
								<path d="M8 15s1.5-1.5 4-1.5 4 1.5 4 1.5" stroke="#FEF9C3" strokeWidth="1.5" fill="none" />
								<circle cx="9" cy="10" r="1" fill="#FEF9C3" />
								<circle cx="15" cy="10" r="1" fill="#FEF9C3" />
							</svg>
					}
						title={"Fear"}
						subtitle={"15"}
						trend="up"
						trendValue={"+0.80%"}
					/>
					<Widget
						icon={
							<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="10" fill="#DC2626" />
								<path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="#FEE2E2" strokeWidth="1.5" fill="none" />
								<circle cx="9" cy="10" r="1" fill="#FEE2E2" />
								<circle cx="15" cy="10" r="1" fill="#FEE2E2" />
							</svg>
						}
						title={"Angry"}
						subtitle={"50"}
						trend="down"
						trendValue={"-3.10%"}
					/>
				</div>
				<TodayEmotionWordCloud />
			</div>

			{/* Charts */}

			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				<EmotionalScore />
				<EmotionalDistribution />
			</div>

			{/* Tables & Charts */}

			<div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
				{/* Check Table */}
				<div>
					<CheckTable
						columnsData={columnsDataCheck}
						tableData={tableDataCheck}
					/>
				</div>

				{/* Traffic chart & Pie Chart */}

				<div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
					<DailyTraffic />
					<PieChartCard />
				</div>

				{/* Complex Table , Task & Calendar */}

				<ComplexTable
					columnsData={columnsDataComplex}
					tableData={tableDataComplex}
				/>

				{/* Task chart & Calendar */}

				<div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
					<TaskCard />
					<div className="grid grid-cols-1 rounded-[20px]">
						<MiniCalendar />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;