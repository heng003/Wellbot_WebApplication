import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useEmotions } from "../../hooks/useEmotions";
import MiniCalendar from "../../dashboard/calendar/MiniCalendar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";

import Widget from "../../dashboard/widget/Widget";
import TodayEmotionWordCloud from "../../components/TodayEmotionWordCloud";
import CheckTable from "../../dashboard/default/CheckTable";
import ComplexTable from "../../dashboard/default/ComplexTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import TaskCard from "../../dashboard/default/TaskCard";
import tableDataCheck from "../../dashboard/variables/tableDataCheck.json";
import tableDataComplex from "../../dashboard/variables/tableDataComplex.json";

import HappyIcon from "../../icons/HappyIcon";
import SadIcon from "../../icons/SadIcon";
import AngryIcon from "../../icons/AngryIcon";
import FearIcon from "../../icons/FearIcon";
import '../../styles/dashboardPage.css';

// import Swal from 'sweetalert2';
// import axios from 'axios';
import { getIdFromToken } from '../../utils/auth';

const emotionConfig = {
	Happy: {
		icon: <HappyIcon />,
		trend: "up",
	},
	Sad: {
		icon: <SadIcon />,
		trend: "down",
	},
	Angry: {
		icon: <AngryIcon />,
		trend: "down",
	},
	Fear: {
		icon: <FearIcon />,
		trend: "up",
	},
};

const DashboardPage = () => {
	const token = localStorage.getItem('token');
	const userId = getIdFromToken();
	// const [startDate, setStartDate] = useState(new Date());
	// const [endDate, setEndDate] = useState(new Date());

	const { emotions, timeSeries, loading } = useEmotions(
		token,
		userId,
		"29-11-2025",
		"30-11-2025"
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
					{/* <Widget
						icon={<HappyIcon />}
						title={"Happy"}
						subtitle={"30"}
						trend="up"
						trendValue={"+2.45%"}
					/>
					<Widget
						icon={<SadIcon />}
						title={"Sad"}
						subtitle={"5"}
						trend="down"
						trendValue={"-1.20%"}
					/>
					<Widget
						icon={<AngryIcon />}
						title={"Fear"}
						subtitle={"15"}
						trend="up"
						trendValue={"+0.80%"}
					/>
					<Widget
						icon={<FearIcon />}
						title={"Angry"}
						subtitle={"50"}
						trend="down"
						trendValue={"-3.10%"}
					/> */}
				</div>
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
				<ComplexTable />

				<DailyTraffic />

				<PieChartCard />

				{/* Complex Table , Task & Calendar */}
				{/* 
				<ComplexTable
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

export default DashboardPage;