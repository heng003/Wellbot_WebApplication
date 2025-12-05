import React, { useState, useEffect, useMemo } from "react";
import PieChart from "../charts/PieChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useInterventionData, getStartEndDate } from "../../hooks/useInterventionData";

const PieChartCard = () => {
	const userId = getIdFromToken();
	const [timeRange, setTimeRange] = useState("monthly");

	// --- Date Picker State ---
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [referenceDate, setReferenceDate] = useState(new Date());
	const [tempInput, setTempInput] = useState("");

	// --- Custom Hook Fetching ---
	// The hook handles the axios call and date calculations internally
	const { data: rawData, loading } = useInterventionData(userId, timeRange, referenceDate);

	// --- Chart Data State ---
	const [chartData, setChartData] = useState([]);
	const [chartOptions, setChartOptions] = useState(basePieOptions);
	const [distribution, setDistribution] = useState([]);

	// --- UPDATED COLOR PALETTE ---
	// 1. Happy (Blue), 2. Sad (Teal), 3. Angry (Purple), 4. Fear (Pink)
	// + 5. Soft Orange, 6. Soft Yellow
	const COLORS = [
		"#519AF6", // Happy
		"#69D5C5", // Sad
		"#7E6FEE", // Angry
		"#EA5E8F", // Fear
		"#FF9F68", // New: Soft Orange
		"#FFD56B", // New: Soft Yellow
		"#A3AED0", // Fallback (Grayish Blue)
	];

	// --- Helper: Format Date for Input ---
	const formatInputDate = (date, range) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		if (range === "weekly") return `${yyyy}-${mm}-${dd}`;
		if (range === "monthly") return `${yyyy}-${mm}`;
		if (range === "yearly") return yyyy;
		return "";
	};

	// --- Effect: Handle Data Processing ---
	useEffect(() => {
		if (!Array.isArray(rawData)) return;

		// --- Client-Side Filtering Safety Net ---
		// Use getStartEndDate to determine the strict range for the current view
		const { start, end } = getStartEndDate(referenceDate, timeRange);

		// Filter the raw data to ensure only logs within the selected range are counted
		// This fixes the issue if the backend returns all data despite query params
		const filteredData = rawData.filter(item => {
			if (!item.timestamp) return false;
			const itemDate = new Date(item.timestamp);
			return itemDate >= start && itemDate <= end;
		});

		// 1. Count occurrences on FILTERED data
		const counts = {};
		filteredData.forEach(log => {
			const type = log.intervention_type || "Unknown";
			counts[type] = (counts[type] || 0) + 1;
		});

		const labels = Object.keys(counts);
		const series = Object.values(counts);
		const total = series.reduce((a, b) => a + b, 0);

		// 2. Update Series
		setChartData(series);

		// 3. Update Options (Dynamic Colors/Labels)
		setChartOptions(prev => ({
			...prev,
			labels: labels,
			colors: COLORS.slice(0, labels.length),
			fill: { colors: COLORS.slice(0, labels.length) }
		}));

		// 4. Update Distribution Legend
		const distData = labels.map((label, index) => ({
			label,
			count: counts[label],
			percentage: total > 0 ? Math.round((counts[label] / total) * 100) : 0,
			color: COLORS[index % COLORS.length]
		}));

		setDistribution(distData.sort((a, b) => b.count - a.count));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [rawData, referenceDate, timeRange]); // Added deps to re-filter if date changes but rawData stays same

	// --- Date Picker Logic ---
	useEffect(() => {
		if (showDatePicker) {
			setTempInput(formatInputDate(referenceDate, timeRange));
		}
	}, [showDatePicker, referenceDate, timeRange]);

	const handleApplyDate = () => {
		if (!tempInput) return;

		const newRefDate = new Date();
		if (timeRange === "weekly") {
			const [y, m, d] = tempInput.split("-").map(Number);
			newRefDate.setFullYear(y, m - 1, d);
		} else if (timeRange === "monthly") {
			const [y, m] = tempInput.split("-").map(Number);
			newRefDate.setFullYear(y, m - 1, 1);
		} else if (timeRange === "yearly") {
			newRefDate.setFullYear(Number(tempInput), 0, 1);
		}

		setReferenceDate(newRefDate);
		setShowDatePicker(false);
	};

	// Helper for Button Label (uses the exported helper from the hook)
	const getDateLabel = () => {
		const { start, end } = getStartEndDate(referenceDate, timeRange);
		if (timeRange === "weekly") {
			return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
		} else if (timeRange === "monthly") {
			return start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
		} else if (timeRange === "yearly") {
			return start.getFullYear().toString();
		}
		return "";
	};

	return (
		<Card extra="col-span-2 rounded-[20px] p-3">
			<div className="flex flex-row justify-between px-3 pt-2">
				<div>
					<h4 className="text-lg font-bold text-navy-700">
						Intervention Types
					</h4>
				</div>

				<div className="flex items-center justify-center gap-2">
					<select
						value={timeRange}
						onChange={(e) => {
							setTimeRange(e.target.value);
							setReferenceDate(new Date()); // Reset to today on change
							setShowDatePicker(false);
						}}
						className="mb-3 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer bg-transparent border-none outline-none focus:ring-0"
					>
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
						<option value="yearly">Yearly</option>
					</select>

					<div className="relative mb-3">
						<button
							onClick={() => setShowDatePicker(!showDatePicker)}
							className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100"
							title={getDateLabel()}
						>
							<MdOutlineCalendarToday className="h-6 w-6" />
						</button>

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
			</div>

			<div className="mb-auto flex h-[220px] w-full items-center justify-center">
				{loading ? (
					<p className="text-sm text-gray-500">Loading...</p>
				) : chartData.length > 0 ? (
					<PieChart options={chartOptions} series={chartData} />
				) : (
					<p className="text-sm text-gray-500">No data for this period</p>
				)}
			</div>

			{/* Dynamic Legend / Distribution List */}
			<div className="rounded-2xl px-7 py-3 shadow-2xl shadow-shadow-500 overflow-y-auto max-h-[160px]">
				{distribution.map((item, index) => (
					<div key={index} className="flex flex-row justify-between items-center mb-2 px-2">
						<div className="flex items-center">
							<div
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<p className="pl-2 text-sm font-normal text-gray-600 truncate" title={item.label}>
								{item.label}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<p className="text-sm font-bold text-navy-700">
								{item.percentage}%
							</p>
							<p className="text-xs text-gray-400">
								({item.count})
							</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};

export default PieChartCard;

// Base options definition (Static parts)
const basePieOptions = {
	chart: {
		width: "50px",
	},
	states: {
		hover: {
			filter: {
				type: "none",
			},
		},
	},
	legend: {
		show: false,
	},
	dataLabels: {
		enabled: false,
	},
	hover: { mode: null },
	plotOptions: {
		donut: {
			expandOnClick: false,
			donut: {
				labels: {
					show: false,
				},
			},
		},
	},
	tooltip: {
		enabled: true,
		theme: "dark",
		style: {
			fontSize: "12px",
			fontFamily: undefined,
			backgroundColor: "#000000"
		},
		y: {
			formatter: function (value) {
				return value + " sessions";
			}
		}
	},
};