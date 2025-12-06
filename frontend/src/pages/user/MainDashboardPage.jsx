import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useEmotions } from "../../hooks/useEmotions";
import MiniCalendar from "../../dashboard/calendar/MiniCalendar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";

import Widget from "../../dashboard/widget/Widget";
import TodayEmotionWordCloud from "../../components/TodayEmotionWordCloud";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";

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
		icon: <HappyIcon />
	},
	Sad: {
		icon: <SadIcon />
	},
	Angry: {
		icon: <AngryIcon />
	},
	Fear: {
		icon: <FearIcon />
	},
};

const MainDashboardPage = () => {
	const token = localStorage.getItem('token');
	const userId = getIdFromToken();
	// const [startDate, setStartDate] = useState(new Date());
	// const [endDate, setEndDate] = useState(new Date());
	const today = new Date().toISOString().slice(0, 10);

	const { emotions, timeSeries, loading } = useEmotions(
		token,
		userId,
		today,
		today,
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
					Main Dashboard
				</h1>
				<p className="page-subtitle">
					Track and analyze your emotional patterns and interactions with Well-Bot
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