import React, { useState, useEffect, useMemo } from "react";
import PieChart from "../charts/PieChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useInterventionData } from "../../hooks/useInterventionData";

const PieChartCard = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const userId = propUserId || getIdFromToken();
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	// --- State ---
	const [timeRange, setTimeRange] = useState("monthly");
	const [referenceDate, setReferenceDate] = useState(new Date());

	// --- Data Fetching ---
	const { data: rawData, loading } = useInterventionData(
		userId,
		isControlled ? "custom" : timeRange,
		referenceDate,
		isControlled ? { start: propStartDate, end: propEndDate } : null
	);

	const [chartData, setChartData] = useState([]);
	const [chartOptions, setChartOptions] = useState(basePieOptions);
	const [distribution, setDistribution] = useState([]);

	const COLORS = ["#4318FF", "#6AD2FF", "#F43F5E", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

	// --- Effect: Process Data ---
	useEffect(() => {
		if (!Array.isArray(rawData)) return;

		const counts = {};
		rawData.forEach(log => {
			const type = log.intervention_type || "Unknown";
			counts[type] = (counts[type] || 0) + 1;
		});

		const labels = Object.keys(counts);
		const series = Object.values(counts);
		const total = series.reduce((a, b) => a + b, 0);

		setChartData(series);
		setChartOptions(prev => ({
			...prev,
			labels: labels,
			colors: COLORS.slice(0, labels.length),
			fill: { colors: COLORS.slice(0, labels.length) }
		}));

		const distData = labels.map((label, index) => ({
			label,
			count: counts[label],
			percentage: total > 0 ? Math.round((counts[label] / total) * 100) : 0,
			color: COLORS[index % COLORS.length]
		}));

		setDistribution(distData.sort((a, b) => b.count - a.count));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rawData]);

	return (
		<Card extra="col-span-1 rounded-[20px] p-3">
			<div className="flex flex-row justify-between px-3 pt-2">
				<div>
					<h4 className="text-lg font-bold text-navy-700">Intervention Types</h4>
				</div>

				{!isControlled && (
					<div className="mb-6 flex items-center justify-center gap-2">
						<select
							value={timeRange}
							onChange={(e) => setTimeRange(e.target.value)}
							className="mb-3 flex items-center justify-center text-sm font-bold text-gray-600 bg-transparent border-none outline-none"
						>
							<option value="weekly">Weekly</option>
							<option value="monthly">Monthly</option>
							<option value="yearly">Yearly</option>
						</select>
						{/* Calendar button hidden for brevity in this snippet */}
					</div>
				)}
			</div>

			<div className="mb-auto flex h-[220px] w-full items-center justify-center">
				{loading ? <p className="text-sm text-gray-500">Loading...</p> :
					chartData.length > 0 ? <PieChart options={chartOptions} series={chartData} /> :
						<p className="text-sm text-gray-500">No data for this period</p>}
			</div>

			<div className="rounded-2xl px-2 py-3 shadow-2xl shadow-shadow-500 overflow-y-auto max-h-[160px]">
				{distribution.map((item, index) => (
					<div key={index} className="flex flex-row justify-between items-center mb-2 px-2">
						<div className="flex items-center">
							<div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
							<p className="pl-2 text-sm font-normal text-gray-600 truncate" title={item.label}>
								{item.label}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm font-bold text-navy-700">{item.percentage}%</p>
							<p className="text-xs text-gray-400">({item.count})</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};

export default PieChartCard;

const basePieOptions = {
	chart: { width: "50px" },
	legend: { show: false },
	dataLabels: { enabled: false },
	tooltip: { enabled: true, theme: "dark" }
};