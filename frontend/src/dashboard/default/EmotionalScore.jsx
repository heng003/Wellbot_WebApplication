import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { getIdFromToken } from "../../utils/auth";
import {
	MdArrowDropUp,
	MdArrowDropDown,
	MdOutlineCalendarToday,
	MdBarChart,
} from "react-icons/md";
import Card from "../card";
import LineChart from "../charts/LineChart";
import { useEmotionalScore } from "../../hooks/useEmotionalScore";

const EmotionalScore = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const currentUserId = getIdFromToken();
	const targetUserId = propUserId || currentUserId;

	// Check if the component is being controlled by a parent dashboard
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	const [timeRange, setTimeRange] = useState("thisMonth");
	const [customStart, setCustomStart] = useState(null);
	const [customEnd, setCustomEnd] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showRangePicker, setShowRangePicker] = useState(false);
	const [bucketType, setBucketType] = useState("day");

	const today = new Date();
	// Helper to get start of current month
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	// Initial date state depends on mode
	const [dateRange, setDateRange] = useState({
		start: isControlled ? propStartDate : startOfMonth,
		end: isControlled ? propEndDate : today
	});

	const chartContainerRef = useRef(null);

	// --- EFFECT: Sync with Parent Props (Controlled Mode) ---
	useEffect(() => {
		if (isControlled) {
			setDateRange({ start: propStartDate, end: propEndDate });
		}
	}, [propStartDate, propEndDate, isControlled]);

	// Calculate dates based on dropdown selection
	const getDateRange = useCallback((range, cStart, cEnd) => {
		const now = new Date();
		let start, end;

		switch (range) {
			case "thisMonth":
				start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
				end = now;
				break;
			case "lastMonth":
				start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
				end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
				break;
			case "custom":
				start = cStart ? new Date(cStart) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
				end = cEnd ? new Date(cEnd) : now;
				break;
			default:
				start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
				end = now;
		}
		return { start, end };
	}, []);

	// --- EFFECT: Handle Internal Date Logic (Standalone Mode) ---
	useEffect(() => {
		if (!isControlled) {
			const { start, end } = getDateRange(timeRange, customStart, customEnd);
			setDateRange({ start, end });
		}
	}, [timeRange, customStart, customEnd, getDateRange, isControlled]);

	// Fetch Data
	const { trendData, loading, refetch } = useEmotionalScore(
		targetUserId,
		dateRange.start,
		dateRange.end,
		bucketType
	);

	// Refetch when dependencies change
	useEffect(() => {
		refetch();
	}, [refetch]);

	// --- Logic for Shifting Time Window (Pagination) ---
	const shiftWindow = (direction) => {
		if (isControlled || !dateRange.start || !dateRange.end) return;

		const startMs = dateRange.start.getTime();
		const endMs = dateRange.end.getTime();
		const windowMs = endMs - startMs;
		// Default to 1 day if window is 0
		const shiftMs = windowMs || 86400000;

		let newStart = new Date(startMs + (direction === "left" ? -shiftMs : shiftMs));
		let newEnd = new Date(endMs + (direction === "left" ? -shiftMs : shiftMs));

		const now = new Date();
		// Prevent going into the future
		if (newEnd > now) {
			const delta = newEnd.getTime() - now.getTime();
			newEnd = new Date(newEnd.getTime() - delta);
			newStart = new Date(newStart.getTime() - delta);
		}

		setCustomStart(newStart);
		setCustomEnd(newEnd);
		setTimeRange("custom");
		setDateRange({ start: newStart, end: newEnd });
	};

	// Determine if we can page left/right based on data availability
	const earliestAvailable = trendData?.dailyData && trendData.dailyData.length > 0
		? new Date(trendData.dailyData[0].date)
		: null;

	const canShiftLeft = useMemo(() => {
		if (!dateRange.start) return false;
		if (!earliestAvailable) return true;
		return dateRange.start.getTime() > earliestAvailable.getTime();
	}, [dateRange.start, earliestAvailable]);

	const canShiftRight = useMemo(() => {
		if (!dateRange.end) return false;
		const now = new Date();
		// Allow shifting right if end date is not today (with small buffer)
		return dateRange.end.getTime() < (now.getTime() - 60000);
	}, [dateRange.end]);


	// --- Chart Data Preparation ---
	const formatTimeLabel = (dateStr, bucket) => {
		if (!dateStr) return "";
		const date = new Date(dateStr);

		if (bucket === "day") {
			return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
		} else if (bucket === "2hour" || bucket === "hour") {
			return date.toLocaleTimeString("en-GB", { hour: "numeric", hour12: true });
		} else if (bucket === "30min") {
			return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
		}
		return dateStr;
	};

	const chartData = useMemo(() => {
		if (!trendData || !trendData.dailyData) return { categories: [], series: [] };

		const dailyData = trendData.dailyData;

		// Map ISO dates to readable labels
		const categories = dailyData.map((d) => formatTimeLabel(d.date, bucketType));

		// Map scores (JSON has avgScore & avgConfidence)
		const series = [
			{
				name: "Emotional Score",
				data: dailyData.map((d) => Math.round(Number(d.avgScore) || 0)),
				color: "#4318FF"
			},
			{
				name: "Confidence",
				// Confidence is usually 0.0-1.0, convert to percentage for chart visibility
				data: dailyData.map((d) => Math.round((Number(d.avgConfidence) || 0) * 100)),
				color: "#6AD2FF"
			},
		];
		return { categories, series };
	}, [trendData, bucketType]);

	// Chart Configuration
	const options = useMemo(() => ({
		legend: { show: false },
		theme: { mode: "light" },
		chart: {
			type: "line",
			toolbar: { show: false },
			zoom: { enabled: false }
		},
		dataLabels: { enabled: false },
		stroke: { curve: "smooth" },
		tooltip: {
			style: { fontSize: "12px", backgroundColor: "#000000" },
			theme: 'light',
			x: {
				formatter: (val, { dataPointIndex }) => {
					// Show full date in tooltip
					if (trendData?.dailyData && trendData.dailyData[dataPointIndex]) {
						const d = new Date(trendData.dailyData[dataPointIndex].date);
						return d.toLocaleString("en-GB", {
							weekday: "short", day: "numeric", month: "short",
							hour: bucketType === "day" ? undefined : "2-digit",
							minute: bucketType === "day" ? undefined : "2-digit"
						});
					}
					return val;
				}
			}
		},
		grid: { show: true, borderColor: "rgba(163, 174, 208, 0.3)", strokeDashArray: 5 },
		xaxis: {
			categories: chartData.categories,
			labels: { style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } },
			axisBorder: { show: false },
			axisTicks: { show: false },
			tooltip: { enabled: false }
		},
		yaxis: { show: false }, // Hide Y Axis for cleaner look
	}), [chartData.categories, bucketType, trendData]);

	// UI Handlers
	const handleTimeRangeChange = (range) => {
		setTimeRange(range);
		setShowDatePicker(false);
	};

	const handleBucketTypeChange = (type) => {
		setBucketType(type);
		setShowRangePicker(false);
	};

	// Calculate Trend Value safely
	const trendValue = Number(trendData?.trendPercentage) || 0;

	return (
		<Card extra="!p-[20px] text-center col-span-1 min-h-[350px]">
			{/* Header */}
			<div className="flex justify-between items-center px-3">
				{!isControlled ? (
					<div className="relative">
						<button
							onClick={() => setShowDatePicker(!showDatePicker)}
							className="linear mt-1 flex items-center justify-center gap-2 mb-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
						>
							<MdOutlineCalendarToday />
							<span className="text-sm font-medium text-gray-600">
								{timeRange === "thisMonth" && "This Month"}
								{timeRange === "lastMonth" && "Last Month"}
								{timeRange === "custom" && "Custom Range"}
							</span>
						</button>
						{showDatePicker && (
							<div className="absolute left-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[200px] text-sm">
								<p className="font-semibold mb-2">Date Range</p>
								<div>
									<div className="flex flex-col justify-content-start">
										<label className="text-xs text-gray-500">From</label>
										<input
											type="date"
											value={customStart ? customStart.toISOString().split("T")[0] : ""}
											max={customEnd ? customEnd.toISOString().split("T")[0] : today.toISOString().split("T")[0]}
											onChange={(e) => setCustomStart(new Date(e.target.value))}
											className="border rounded p-1"
										/>
									</div>
									<div className="flex flex-col justify-content-start">
										<label className="text-xs text-gray-500">To</label>
										<input
											type="date"
											value={customEnd ? customEnd.toISOString().split("T")[0] : ""}
											min={customStart ? customStart.toISOString().split("T")[0] : ""}
											max={today.toISOString().split("T")[0]}
											onChange={(e) => setCustomEnd(new Date(e.target.value))}
											className="border rounded p-1"
										/>
									</div>
									<button
										onClick={() => handleTimeRangeChange("custom")}
										className="w-full bg-brand-500 text-white rounded py-1 mt-2 hover:bg-brand-600 transition"
									>
										Apply
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<h2 className="text-lg font-bold text-navy-700">Emotional Trends</h2>
				)}

				<div className="relative">
					<button
						onClick={() => setShowRangePicker(!showRangePicker)}
						className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200"
					>
						<MdBarChart className="h-6 w-6" />
					</button>
					{showRangePicker && (
						<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-2 z-10 text-black min-w-[150px]">
							<p className="text-xs text-gray-500 mb-1 px-2">Data Interval</p>
							{["30min", "hour", "2hour", "day"].map((bucket) => (
								<button
									key={bucket}
									onClick={() => handleBucketTypeChange(bucket)}
									className={`block w-full text-left px-3 py-1 rounded mb-1 text-sm ${bucketType === bucket ? 'bg-brand-50 text-brand-500 font-bold' : 'hover:bg-gray-100'}`}
								>
									{bucket === "day" ? "Daily" : bucket.replace("hour", " Hour").replace("min", " Min")}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="flex h-full w-full flex-col px-3 mt-4">
				{/* Statistics Row */}
				<div className="flex flex-row justify-between items-start mb-4">
					<div className="flex flex-col items-start">
						<p className="text-sm text-gray-600">Current Score</p>
						<p className="text-3xl font-bold text-navy-700">
							{loading ? "..." : `${Math.round(trendData?.currentScore || 0)}`}
						</p>

						<div className="flex flex-row items-center mt-1">
							{/* Logic for Trend Icon */}
							{trendData?.trendDirection === "up" && (
								<MdArrowDropUp className="font-medium text-green-500 h-5 w-5" />
							)}
							{trendData?.trendDirection === "down" && (
								<MdArrowDropDown className="font-medium text-red-500 h-5 w-5" />
							)}

							{/* Logic for Trend Text */}
							<p className={`text-sm font-bold ${trendData?.trendDirection === "up" ? "text-green-500" :
								trendData?.trendDirection === "down" ? "text-red-500" : "text-gray-500"
								}`}>
								{trendData?.trendDirection === "stable"
									? "No change"
									: `${trendValue}%`
								}
							</p>
						</div>
					</div>

					{!isControlled && (
						<div className="flex items-center gap-1">
							<button
								onClick={() => shiftWindow("left")}
								disabled={!canShiftLeft}
								className={`p-1 rounded ${canShiftLeft ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
							>
								◀
							</button>
							<button
								onClick={() => shiftWindow("right")}
								disabled={!canShiftRight}
								className={`p-1 rounded ${canShiftRight ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
							>
								▶
							</button>
						</div>
					)}
				</div>

				{/* Chart Area */}
				<div className="h-[250px] w-full" ref={chartContainerRef}>
					{loading ? (
						<div className="flex h-full items-center justify-center">
							<p className="text-gray-400 animate-pulse">Loading data...</p>
						</div>
					) : chartData.series && chartData.series.length > 0 && chartData.series[0].data.length > 0 ? (
						// ^^^ FIXED LINE: Check if series exists AND has items before checking data
						<LineChart
							options={options}
							series={chartData.series}
						/>
					) : (
						<div className="flex h-full items-center justify-center bg-gray-50 rounded-lg">
							<p className="text-gray-400">No data available for this period</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default EmotionalScore;