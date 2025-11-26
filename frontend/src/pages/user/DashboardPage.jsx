import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useEmotions } from "../../hooks/useEmotions";
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

// import Swal from 'sweetalert2';
// import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';

const emotionConfig = {
	Happy: {
		icon: (
			<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
				<circle cx="12" cy="12" r="10" fill="var(--primary-color)" />
				<path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#DCFCE7" strokeWidth="1.5" fill="none" />
				<circle cx="9" cy="10" r="1" fill="#DCFCE7" />
				<circle cx="15" cy="10" r="1" fill="#DCFCE7" />
			</svg>
		),
		trend: "up",
	},
	Sad: {
		icon: (
			<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
				<circle cx="12" cy="12" r="10" fill="#2563EB" />
				<path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="#DBEAFE" strokeWidth="1.5" fill="none" />
				<circle cx="9" cy="10" r="1" fill="#DBEAFE" />
				<circle cx="15" cy="10" r="1" fill="#DBEAFE" />
			</svg>
		),
		trend: "down",
	},
	Fear: {
		icon: (
			<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
				<circle cx="12" cy="12" r="10" fill="#EAB308" />
				<path d="M8 15s1.5-1.5 4-1.5 4 1.5 4 1.5" stroke="#FEF9C3" strokeWidth="1.5" fill="none" />
				<circle cx="9" cy="10" r="1" fill="#FEF9C3" />
				<circle cx="15" cy="10" r="1" fill="#FEF9C3" />
			</svg>
		),
		trend: "up",
	},
	Angry: {
		icon: (
			<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
				<circle cx="12" cy="12" r="10" fill="#DC2626" />
				<path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="#FEE2E2" strokeWidth="1.5" fill="none" />
				<circle cx="9" cy="10" r="1" fill="#FEE2E2" />
				<circle cx="15" cy="10" r="1" fill="#FEE2E2" />
			</svg>
		),
		trend: "down",
	},
};

const DashboardPage = () => {
	const token = localStorage.getItem('token');
	const userId = getIdFromToken();
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [searchTerm, setSearchTerm] = useState("");

	const { emotions, timeSeries, loading } = useEmotions(
		token,
		userId,
		startDate.toISOString().slice(0, 10),
		endDate.toISOString().slice(0, 10)
	);

	if (emotions && emotions.length > 0) {
		console.log("Emotions:", emotions[0].emotion_label);
	} else {
		console.log("No emotions data yet");
	}


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

			<div className="bg-white dark:bg-navy-800 rounded-2xl p-4 mb-6 shadow-md">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
					<div className="flex flex-col">
						<label className="mb-2 text-sm text-gray-600">From Date</label>
						<DatePicker
							selected={startDate}
							onChange={(d) => setStartDate(d)}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-2 text-sm text-gray-600">To Date</label>
						<DatePicker
							selected={endDate}
							onChange={(d) => setEndDate(d)}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-2 text-sm text-gray-600">Search</label>
						<input
							type="text"
							label="Search emotions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full"
						/>
					</div>
				</div>
			</div>

			<div>
				<div className="flex gap-4 mb-4">
					<DatePicker selected={startDate} onChange={(d) => setStartDate(d)} />
					<DatePicker selected={endDate} onChange={(d) => setEndDate(d)} />
				</div>

				{loading ? <p>Loading...</p> : <p>Data Loaded ✅</p>}
			</div>
			{/* Card widget and word cloud responsive layout */}

			<div className="dashboard-flex-row ">
				<div className="dashboard-widget-grid">
					{emotions && emotions.map((e) => {
						const config = emotionConfig[e.emotion_label] || {};
						return (
							<Widget
								key={e.emotion_label}
								icon={config.icon}
								title={e.emotion_label}
								subtitle={e.count}
								trend={config.trend}
								trendValue={
									// Example: trend value from avg_confidence
									`${(e.avg_confidence * 100).toFixed(1)}%`
								}
							/>
						);
					})}
				</div>
				{/* <TodayEmotionWordCloud /> */}
			</div>

			{/* Charts */}

			<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				<EmotionalScore
					timeSeries={timeSeries}
				/>
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