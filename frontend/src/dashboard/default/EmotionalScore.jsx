import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
	MdArrowDropUp,
	MdArrowDropDown,
	MdOutlineCalendarToday,
	MdBarChart,
} from "react-icons/md";
import Card from "../card";
import LineChart from "../charts/LineChart";
import { useEmotionalData } from "../../hooks/useEmotionalData";

const EmotionalScore = ({ startDate: propStartDate, endDate: propEndDate }) => {
	// Check if the component is being controlled by a parent dashboard
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	const [timeRange, setTimeRange] = useState("thisMonth");
	const [customStart, setCustomStart] = useState(null);
	const [customEnd, setCustomEnd] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showRangePicker, setShowRangePicker] = useState(false);
	const [bucketType, setBucketType] = useState("day");

	// Initial date state depends on mode
	const [dateRange, setDateRange] = useState({
		start: isControlled ? propStartDate : null,
		end: isControlled ? propEndDate : null
	});

	const chartContainerRef = useRef(null);
	const adjustmentTimerRef = useRef(null);
	const prevLabelCountRef = useRef(0);
	const today = new Date();
	const todayRef = useRef(new Date());

	const bucketProgression = ["15min", "30min", "hour", "2hour", "day"];

	// --- EFFECT: Sync with Parent Props (Controlled Mode) ---
	useEffect(() => {
		if (isControlled) {
			setDateRange({ start: propStartDate, end: propEndDate });
		}
	}, [propStartDate, propEndDate, isControlled]);

	const getDateRange = useCallback((timeRange, customStart, customEnd) => {
		const today = todayRef.current;
		let start, end;

		switch (timeRange) {
			case "thisMonth":
				start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
				end = today;
				break;
			case "lastMonth":
				start = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
				end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
				break;
			case "custom":
				start = customStart
					? new Date(customStart)
					: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
				end = customEnd
					? new Date(customEnd)
					: today;
				break;
			default:
				start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
				end = today;
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

	const { trendData, loading, refetch } = useEmotionalData(
		dateRange.start,
		dateRange.end,
		bucketType
	);

	const refetchRef = useRef(refetch);
	useEffect(() => {
		refetchRef.current = refetch;
	}, [refetch]);

	useEffect(() => {
		refetchRef.current?.();
	}, [dateRange.start, dateRange.end, bucketType]);

	const shiftWindow = (direction) => {
		if (isControlled) return; // Disable shifting in controlled mode

		if (!dateRange.start || !dateRange.end) return;
		const startMs = dateRange.start.getTime();
		const endMs = dateRange.end.getTime();
		const windowMs = endMs - startMs;
		const shiftMs = windowMs || 24 * 60 * 60 * 1000;

		let newStart = new Date(startMs + (direction === "left" ? -shiftMs : shiftMs));
		let newEnd = new Date(endMs + (direction === "left" ? -shiftMs : shiftMs));

		const now = new Date();
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

	const earliestAvailable = trendData?.dailyData && trendData.dailyData.length > 0
		? new Date(trendData.dailyData[0].date)
		: null;
	const canShiftLeft = (() => {
		if (!dateRange.start) return false;
		if (!earliestAvailable) return true;
		return dateRange.start.getTime() > earliestAvailable.getTime();
	})();
	const canShiftRight = (() => {
		if (!dateRange.end) return false;
		const now = new Date();
		return dateRange.end.getTime() < now.getTime();
	})();

	const getOptimalBucketType = (labelCount) => {
		if (labelCount <= 3) return "day";
		if (labelCount <= 6) return "day";
		if (labelCount <= 12) return "2hour";
		if (labelCount <= 24) return "hour";
		if (labelCount <= 48) return "30min";
		return "15min";
	};

	const handleChartSelection = useCallback((chartContext, { xaxis }) => {
		if (isControlled) return; // Disable drag selection in controlled mode

		if (!xaxis || !xaxis.min || !xaxis.max) return;
		try {
			const minDate = new Date(xaxis.min);
			const maxDate = new Date(xaxis.max);
			setCustomStart(minDate);
			setCustomEnd(maxDate);
			setTimeRange("custom");
			setDateRange({ start: minDate, end: maxDate });
			setShowDatePicker(false);
			setShowRangePicker(false);
		} catch (err) {
			console.error("Error handling chart selection:", err);
		}
	}, [isControlled]);

	const formatTimeLabel = (dateStr, bucket) => {
		const date = new Date(dateStr);
		if (bucket === "day") return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
		else if (bucket === "2hour" || bucket === "hour") return date.toLocaleTimeString("en-GB", { hour: "numeric", hour12: true });
		else if (bucket === "30min" || bucket === "15min") return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });
		return dateStr;
	};

	const prepareChartData = () => {
		if (!trendData || !trendData.dailyData) return { categories: [], series: [] };
		const dailyData = trendData.dailyData;
		const categories = dailyData.map((d) => formatTimeLabel(d.date, bucketType));
		const series = [
			{ name: "Emotional Score", data: dailyData.map((d) => Math.round(d.avgScore)), color: "#4318FF" },
			{ name: "Confidence", data: dailyData.map((d) => Math.round(d.avgConfidence * 100)), color: "#6AD2FF" },
		];
		return { categories, series };
	};

	const chartData = prepareChartData();

	const options = useMemo(() => ({
		legend: { show: false },
		theme: { mode: "light" },
		chart: {
			type: "line",
			toolbar: { show: false },
			selection: { enabled: !isControlled, xaxis: { min: undefined, max: undefined } },
			events: { selection: handleChartSelection },
		},
		dataLabels: { enabled: false },
		stroke: { curve: "smooth" },
		tooltip: {
			style: { fontSize: "12px", fontFamily: undefined, backgroundColor: "#000000" },
			theme: 'light',
			x: {
				formatter: (value, { series, seriesIndex, dataPointIndex }) => {
					if (trendData?.dailyData && trendData.dailyData[dataPointIndex]) {
						const dateStr = trendData.dailyData[dataPointIndex].date;
						const date = new Date(dateStr);
						if (bucketType === "day") {
							return date.toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
						} else {
							return date.toLocaleString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
						}
					}
					return value;
				},
			},
		},
		grid: { show: false, padding: { top: 0, bottom: 0, left: 30, right: 30 } },
		xaxis: {
			axisBorder: { show: false },
			axisTicks: { show: false },
			labels: { style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" }, hideOverlappingLabels: true },
			type: "text",
			range: undefined,
			categories: chartData.categories,
		},
		yaxis: { show: false },
	}), [chartData.categories, bucketType, handleChartSelection, trendData, isControlled]);

	const handleTimeRangeChange = useCallback((range) => {
		setTimeRange(range);
		setShowDatePicker(false);
	}, []);

	const handleBucketTypeChange = useCallback((type) => {
		setBucketType(type);
		setShowRangePicker(false);
	}, []);

	return (
		<Card extra="!p-[20px] text-center col-span-1 ">
			{/* Header: Hide controls if Controlled by parent */}
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
							<div className="absolute left-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[180px] text-sm">
								<p className="font-semibold mb-2">Date Range</p>
								<div className="flex justify-between">
									<label className="p-1">From:</label>
									<input
										type="date"
										value={customStart ? customStart.toISOString().split("T")[0] : ""}
										max={customEnd ? customEnd.toISOString().split("T")[0] : today.toISOString().split("T")[0]}
										onChange={(e) => setCustomStart(new Date(e.target.value))}
										className="border rounded p-1"
									/>
								</div>
								<div className="flex justify-between">
									<label className="p-1">To:</label>
									<input
										type="date"
										value={customEnd ? customEnd.toISOString().split("T")[0] : ""}
										min={customStart ? customStart.toISOString().split("T")[0] : ""}
										max={today.toISOString().split("T")[0]}
										onChange={(e) => setCustomEnd(new Date(e.target.value))}
										className="border rounded p-1"
									/>
								</div>
								<button onClick={() => handleTimeRangeChange("custom")} className="btn-submit mt-3">Apply</button>
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
						<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[180px]">
							<p className="text-sm font-semibold mb-2">Emotion Range</p>
							{bucketProgression.map((bucket) => (
								<button
									key={bucket}
									onClick={() => handleBucketTypeChange(bucket)}
									className={"block w-full text-left px-3 py-1 rounded mb-1 text-sm hover:bg-gray-100"}
								>
									Per {bucket === "day" ? "Day" : bucket.replace("hour", " Hour").replace("min", " Minutes")}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="flex h-full w-full flex-row justify-between flex-wrap px-3">
				<div className="flex flex-col">
					<p className="mt-[20px] text-3xl font-bold text-navy-700">
						{loading ? "-" : `${trendData?.currentScore || 0}%`}
					</p>
					<div className="flex flex-col items-start">
						<p className="mt-2 text-sm text-gray-600">Emotional Score</p>
						<div className="flex flex-row items-center justify-center">
							{trendData?.trendDirection === "up" && (
								<>
									<MdArrowDropUp className="font-medium text-green-500" />
									<p className="text-sm font-bold text-green-500">+{trendData.trendPercentage}%</p>
								</>
							)}
							{trendData?.trendDirection === "down" && (
								<>
									<MdArrowDropDown className="font-medium text-red-500" />
									<p className="text-sm font-bold text-red-500">{trendData.trendPercentage}%</p>
								</>
							)}
							{trendData?.trendDirection === "stable" && (
								<p className="text-sm font-bold text-gray-500">No change</p>
							)}
						</div>
					</div>
				</div>
				{!isControlled && (
					<div className="flex items-center gap-2 mb-3">
						<button
							onClick={() => shiftWindow("left")}
							disabled={!canShiftLeft}
							className={`px-2 py-1 rounded ${canShiftLeft ? 'bg-gray-200' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
						>
							◀
						</button>
						<button
							onClick={() => shiftWindow("right")}
							disabled={!canShiftRight}
							className={`px-2 py-1 rounded ${canShiftRight ? 'bg-gray-200' : 'bg-gray-100 opacity-50 cursor-not-allowed'}`}
						>
							▶
						</button>
					</div>
				)}
				<div className="h-full w-full" ref={chartContainerRef}>
					{chartData.series.length > 0 ? (
						<LineChart
							options={options}
							series={chartData.series}
							enableZoom={false}
						/>
					) : (
						<p className="text-gray-400 text-center py-8">No data available</p>
					)}
				</div>
			</div>
		</Card>
	);
};

export default EmotionalScore;