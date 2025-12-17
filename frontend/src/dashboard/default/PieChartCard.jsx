import React, { useState, useEffect, useMemo } from "react";
import PieChart from "../charts/PieChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useInterventionData, getStartEndDate } from "../../hooks/useInterventionData";
import HoverTooltip from "../../components/HoverTooltip";

const PieChartCard = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const userId = propUserId || getIdFromToken();
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	// --- State ---
	const [timeRange, setTimeRange] = useState("monthly");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [referenceDate, setReferenceDate] = useState(new Date());
	const [tempInput, setTempInput] = useState("");

	// Memoize the custom range object so it doesn't trigger the hook on every render
	const customRange = useMemo(() => {
		if (isControlled && propStartDate && propEndDate) {
			return { start: propStartDate, end: propEndDate };
		}
		return null;
	}, [isControlled, propStartDate, propEndDate]);

	// --- Data Fetching ---
	const { data: rawData, loading } = useInterventionData(
		userId,
		isControlled ? "custom" : timeRange,
		referenceDate,
		customRange
	);

	const [chartData, setChartData] = useState([]);
	const [chartOptions, setChartOptions] = useState(basePieOptions);
	const [distribution, setDistribution] = useState([]);

	const COLOR_MAP = useMemo(() => ({
		"Support Chat": "#519AF6",
		"Journaling": "#69D5C5",
		"Gratitude": "#EA5E8F",
		"Meditation with Music": "#FF9F68",
		"Daily Quote": "#FFD56B"
	}), []);

	const FIXED_ORDER = useMemo(() => [
		"Support Chat",
		"Journaling",
		"Gratitude",
		"Meditation with Music",
		"Daily Quote"
	], []);

	const formatInputDate = (date, range) => {
		if (!date) return "";
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		if (range === "weekly") return `${yyyy}-${mm}-${dd}`;
		if (range === "monthly") return `${yyyy}-${mm}`;
		if (range === "yearly") return yyyy;
		return "";
	};

	// ... imports and state setup ...

	useEffect(() => {
		if (!Array.isArray(rawData)) return;

		// 1. Calculate the strict Date Boundaries for this render
		let start, end;
		if (isControlled) {
			start = new Date(propStartDate);
			end = new Date(propEndDate);
		} else {
			// Use the helper to get the exact start/end for the current view
			const dates = getStartEndDate(referenceDate, timeRange);
			start = dates.start;
			end = dates.end;
		}

		// Convert to timestamps for easy comparison
		const startTime = start.getTime();
		const endTime = end.getTime();

		const counts = {};

		rawData.forEach(log => {
			// 2. STRICT CLIENT-SIDE FILTERING
			// Ensure we strictly only count logs that fall within the visual range.
			// This protects against API returning extra data or caching issues.
			if (!log.timestamp) return;

			const logDate = new Date(log.timestamp);
			const logTime = logDate.getTime();

			// Check if log is within the start/end window
			if (logTime >= startTime && logTime <= endTime) {
				const type = log.intervention_type || "Unknown";
				counts[type] = (counts[type] || 0) + 1;
			}
		});

		const orderedSeries = [];
		const orderedLabels = [];
		const orderedColors = [];

		FIXED_ORDER.forEach(type => {
			if (counts[type] > 0) {
				orderedSeries.push(counts[type]);
				orderedLabels.push(type);
				orderedColors.push(COLOR_MAP[type]);
			}
		});

		// Handle "Unknown" types if any exist (append to end)
		Object.keys(counts).forEach(type => {
			if (!FIXED_ORDER.includes(type) && counts[type] > 0) {
				orderedSeries.push(counts[type]);
				orderedLabels.push(type);
				orderedColors.push("#A3AED0"); // Default gray
			}
		});

		setChartData(orderedSeries);
		setChartOptions(prev => ({
			...prev,
			labels: orderedLabels,
			colors: orderedColors,
			fill: { colors: orderedColors }
		}));

		const total = orderedSeries.reduce((a, b) => a + b, 0);

		const allPresentKeys = Object.keys(counts);

		const distData = allPresentKeys.map(label => ({
			label,
			count: counts[label],
			percentage: total > 0 ? Math.round((counts[label] / total) * 100) : 0,
			color: COLOR_MAP[label] || "#A3AED0"
		}));

		// Sort descending by count for the list
		setDistribution(distData.sort((a, b) => b.count - a.count));
	}, [rawData, referenceDate, timeRange, isControlled, propStartDate, propEndDate, COLOR_MAP, FIXED_ORDER]);

	useEffect(() => {
		if (showDatePicker) {
			setTempInput(formatInputDate(referenceDate, timeRange));
		}
	}, [showDatePicker, referenceDate, timeRange]);

	const handleApplyDate = () => {
		if (!tempInput) return;

		const newRefDate = new Date();
		// Vital: Reset time to midnight to avoid timezone slippage
		newRefDate.setHours(0, 0, 0, 0);

		if (timeRange === "weekly") {
			// tempInput = "2025-11-20"
			const [y, m, d] = tempInput.split("-").map(Number);
			newRefDate.setFullYear(y, m - 1, d);
		} else if (timeRange === "monthly") {
			// tempInput = "2025-11"
			const [y, m] = tempInput.split("-").map(Number);
			newRefDate.setFullYear(y, m - 1, 1); // Set to 1st of month
		} else if (timeRange === "yearly") {
			// tempInput = "2025"
			newRefDate.setFullYear(Number(tempInput), 0, 1); // Set to Jan 1st
		}

		setReferenceDate(newRefDate);
		setShowDatePicker(false);
	};

	// Helper for Button Label (uses the exported helper from the hook)
	const getDateLabel = () => {
		// Safe check: if hook helper fails, default to today
		try {
			const { start, end } = getStartEndDate(referenceDate, timeRange);
			if (timeRange === "weekly") {
				return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
			} else if (timeRange === "monthly") {
				return start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
			} else if (timeRange === "yearly") {
				return start.getFullYear().toString();
			}
		} catch (e) { return ""; }
		return "";
	};

	return (
		<Card extra="col-span-1 rounded-[20px] p-3">
			<div className="flex flex-row justify-between px-3 pt-2">
				<div>
					<h4 className="text-lg font-bold text-navy-700">Activity Types</h4>
				</div>

				{!isControlled && (
					<div className="mb-6 flex items-center justify-center gap-2">
						<HoverTooltip content="Customize to yearly, monthly, or weekly view">
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="mb-3 flex items-center justify-center text-sm font-bold text-gray-600 bg-transparent border-none outline-none"
							>
								<option value="weekly">Weekly</option>
								<option value="monthly">Monthly</option>
								<option value="yearly">Yearly</option>
							</select>
						</HoverTooltip>
						<div className="relative mb-3">
							<HoverTooltip content="Select custom date range">
								<button
									onClick={() => setShowDatePicker(!showDatePicker)}
									className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100"
									title={getDateLabel()}
								>
									<MdOutlineCalendarToday className="h-6 w-6" />
								</button>
							</HoverTooltip>

							{/* Date Picker Popover */}
							{showDatePicker && (
								<div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[220px] text-sm">
									<p className="font-semibold mb-2">
										Select {timeRange === 'weekly' ? 'Week' : timeRange === 'monthly' ? 'Month' : 'Year'}
									</p>

									<div className="mb-3">
										{timeRange === 'weekly' && (
											<>
												<p className="text-xs text-gray-500 mb-1">Pick any date in the week:</p>
												<input
													type="date"
													className="w-full border rounded p-1"
													value={tempInput}
													onChange={(e) => setTempInput(e.target.value)}
												/>
											</>
										)}
										{timeRange === 'monthly' && (
											<input
												type="month"
												className="w-full border rounded p-1"
												value={tempInput}
												onChange={(e) => setTempInput(e.target.value)}
											/>
										)}
										{timeRange === 'yearly' && (
											<input
												type="number"
												placeholder="YYYY"
												min="2000"
												max="2100"
												className="w-full border rounded p-1"
												value={tempInput}
												onChange={(e) => setTempInput(e.target.value)}
											/>
										)}
									</div>

									<div className="flex justify-end gap-2">
										<button
											onClick={() => setShowDatePicker(false)}
											className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
										>
											Cancel
										</button>
										<button
											onClick={handleApplyDate}
											className="rounded-lg bg-brand-500 px-3 py-1 text-white hover:bg-brand-600"
										>
											Apply
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="mb-auto flex h-[220px] w-full items-center justify-center">
				{loading ? <p className="text-sm text-gray-500">Loading...</p> :
					chartData.length > 0 ? <PieChart options={chartOptions} series={chartData} /> :
						<p className="text-sm text-gray-500">No data for this period</p>}
			</div>

			<div className="rounded-2xl py-3 px-3 shadow-2xl shadow-shadow-500 overflow-y-auto">
				{distribution.map((item, index) => (
					<div key={index} className="flex flex-row justify-between items-center mb-2 px-2">
						<div className="flex items-center">
							<div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
							<p className="pl-3 text-sm font-normal text-gray-800 truncate" title={item.label}>
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