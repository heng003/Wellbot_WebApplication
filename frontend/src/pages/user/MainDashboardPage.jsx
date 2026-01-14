import React, { useState, useEffect } from "react";
import axios from "axios";
import { getIdFromToken } from "../../utils/auth";
import EmbeddingVisualizer from "../../components/EmbeddingVisualizer";
import FloatingNavbar from "../../layout/FloatingNavbar";
import EmotionalDistribution from "../../dashboard/default/EmotionalDistribution";
import EmotionalScore from "../../dashboard/default/EmotionalScore";
import PieChartCard from "../../dashboard/default/PieChartCard";
import RecentActivitiesTable from "../../dashboard/default/RecentActivitiesTable";
import DailyTraffic from "../../dashboard/default/DailyTraffic";
import DisplayWidgets from "../../components/DisplayWidgets"
import MoodActivityCorrelation from "../../dashboard/default/MoodActivityCorrelation";
import '../../styles/dashboardPage.css';

import { useTranslation } from "react-i18next";

const MainDashboardPage = () => {
	const { t } = useTranslation();
	const [embeddings, setEmbeddings] = useState([]);
	const [loadingEmbeddings, setLoadingEmbeddings] = useState(false);

	// Unified Date State
	const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
	const [endDate, setEndDate] = useState(new Date());

	const userId = getIdFromToken();

	useEffect(() => {
		const fetchEmbeddings = async () => {
			if (!userId) return;
			setLoadingEmbeddings(true);
			try {
				const token = localStorage.getItem('token');
				let url = `/api/embedding/${userId}`;
				if (startDate && endDate) {
					const s = startDate.toISOString().split('T')[0];
					const e = endDate.toISOString().split('T')[0];
					url += `?startDate=${s}&endDate=${e}`;
				}

				const res = await axios.get(url, {
					headers: { Authorization: `Bearer ${token}` }
				});
				setEmbeddings(res.data.data || []);
			} catch (err) {
				console.error("Failed to fetch embeddings", err);
			} finally {
				setLoadingEmbeddings(false);
			}
		};
		fetchEmbeddings();
	}, [userId, startDate, endDate]);

	return (
		<div className="main-container">
			<FloatingNavbar
				brandText={t('dashboard.main_title')}
			/>

			<div>
				<h4 className="pl-4 text-lg font-bold text-navy-700">{t('dashboard.todays_emotion_count')}</h4>
				<DisplayWidgets />
			</div>

			{/* <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-3">
				<EmotionalScore />
				<EmotionalDistribution />
			</div> */}

			<div className="grid grid-cols-1 gap-3 lg:grid-cols-2 mt-3">
				<EmotionalScore />
				<PieChartCard />
			</div>

			{/* Tables */}
			<div className="mt-3">
				<RecentActivitiesTable />
			</div>

			<div className="mt-3">
				<EmbeddingVisualizer
					rawEmbeddings={embeddings}
					height="350px"
					loading={loadingEmbeddings}
					onDateChange={(start, end) => {
						setStartDate(start);
						setEndDate(end);
					}}
				/>
			</div>

			{/* Charts */}
			{/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
				<DailyTraffic />

				<PieChartCard />
			</div> */}

			<div className="mt-3">
				<MoodActivityCorrelation hideSummary={true} />
			</div>
		</div>
	);
};

export default MainDashboardPage;