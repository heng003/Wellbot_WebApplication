import React, { useEffect, useState, useRef, useCallback } from "react";
import {
	MdArrowDropUp,
	MdArrowDropDown,
	MdOutlineCalendarToday,
	MdBarChart,
} from "react-icons/md";
import Card from "../card";
import LineChart from "../charts/LineChart";
import { useEmotionalData } from "../../hooks/useEmotionalData";

const EmotionalScore = () => {
	const [timeRange, setTimeRange] = useState("thisMonth");
	const [customStart, setCustomStart] = useState(null);
	const [customEnd, setCustomEnd] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showRangePicker, setShowRangePicker] = useState(false);
	const [bucketType, setBucketType] = useState("day");
	const [autoBucketType, setAutoBucketType] = useState("day");
	const [isAutoMode, setIsAutoMode] = useState(true);
	const [dateRange, setDateRange] = useState({ start: null, end: null });
	const chartContainerRef = useRef(null);
	const adjustmentTimerRef = useRef(null);
	const prevLabelCountRef = useRef(0);
	const today = new Date();

	// keep a stable "now" for the component lifetime to avoid recreating getDateRange each render
	const todayRef = useRef(new Date());

	// Bucket progression: smaller to larger
	const bucketProgression = ["15min", "30min", "hour", "2hour", "day"];

	// Get date range based on selected period. use a stable todayRef so this callback identity stays stable.
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
					? new Date(customStart.getFullYear(), customStart.getMonth(), customStart.getDate(), 0, 0, 0, 0)
					: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
				end = customEnd
					? new Date(customEnd.getFullYear(), customEnd.getMonth(), customEnd.getDate(), 23, 59, 59, 999)
					: today;
				break;

			default:
				start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
				end = today;
		}

		return { start, end };
	}, []);

	// compute initial dateRange when timeRange/customStart/customEnd change
	useEffect(() => {
		const { start, end } = getDateRange(timeRange, customStart, customEnd);
		setDateRange({ start, end });
	}, [timeRange, customStart, customEnd, getDateRange]);

	// fetch data when dateRange or bucket changes
	const { trendData, loading, refetch } = useEmotionalData(
		dateRange.start,
		dateRange.end,
		isAutoMode ? autoBucketType : bucketType
	);

	// keep a ref to the latest refetch function to avoid creating effect dependency on refetch identity
	const refetchRef = useRef(refetch);
	useEffect(() => {
		refetchRef.current = refetch;
	}, [refetch]);

	useEffect(() => {
		// call the latest refetch; this effect only depends on dateRange/bucket/isAutoMode
		refetchRef.current?.();
	}, [dateRange.start, dateRange.end, bucketType, autoBucketType, isAutoMode]);

	// Shift window left/right by its current length (useful fallback)
	const shiftWindow = (direction /* 'left' | 'right' */) => {
		if (!dateRange.start || !dateRange.end) return;
		const startMs = dateRange.start.getTime();
		const endMs = dateRange.end.getTime();
		const windowMs = endMs - startMs;
		const shiftMs = windowMs || 24 * 60 * 60 * 1000; // default 1 day if zero

		let newStart = new Date(startMs + (direction === "left" ? -shiftMs : shiftMs));
		let newEnd = new Date(endMs + (direction === "left" ? -shiftMs : shiftMs));

		// Prevent shifting to future beyond now
		const now = new Date();
		if (newEnd > now) {
			// clamp to now
			const delta = newEnd.getTime() - now.getTime();
			newEnd = new Date(newEnd.getTime() - delta);
			newStart = new Date(newStart.getTime() - delta);
		}

		// set custom mode and update states
		setCustomStart(newStart);
		setCustomEnd(newEnd);
		setTimeRange("custom");
		setIsAutoMode(false);
		setDateRange({ start: newStart, end: newEnd });
	};

	// disable left if no earlier data available (use trendData earliest), disable right if end >= now
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

	// Determine optimal bucket type based on label count
	const getOptimalBucketType = (labelCount) => {
		if (labelCount <= 3) return "day";
		if (labelCount <= 6) return "day";
		if (labelCount <= 12) return "2hour";
		if (labelCount <= 24) return "hour";
		if (labelCount <= 48) return "30min";
		return "15min";
	};

	// Smart adjustment based on label count boundaries
	const adjustBucketTypeSmartly = (labelCount, currentBucket) => {
		const currentIndex = bucketProgression.indexOf(currentBucket);
		if (currentIndex === -1) return currentBucket;

		// If label count is ≤3, go one level smaller (finer granularity)
		// unless already at smallest (15min)
		if (labelCount <= 3 && currentIndex > 0) {
			return bucketProgression[currentIndex - 1];
		}

		// If label count is ≥12, go one level larger (coarser granularity)
		// unless already at largest (day)
		if (labelCount >= 12 && currentIndex < bucketProgression.length - 1) {
			return bucketProgression[currentIndex + 1];
		}

		return currentBucket;
	};

	// Count rendered x-axis labels and auto-adjust bucket type
	const adjustBucketTypeBasedOnLabels = () => {
		if (!isAutoMode) return;

		const xaxisTextsGroup = document.querySelector('.apexcharts-xaxis-texts-g');
		if (!xaxisTextsGroup) return;

		const labelCount = xaxisTextsGroup.querySelectorAll('tspan').length;

		// Avoid unnecessary updates if label count hasn't changed significantly
		if (Math.abs(labelCount - prevLabelCountRef.current) < 2) return;
		prevLabelCountRef.current = labelCount;

		// Use smart adjustment at boundaries, otherwise use optimal
		let optimalBucket;
		if (labelCount <= 3 || labelCount >= 12) {
			optimalBucket = adjustBucketTypeSmartly(labelCount, autoBucketType);
		} else {
			optimalBucket = getOptimalBucketType(labelCount);
		}

		if (optimalBucket !== autoBucketType) {
			setAutoBucketType(optimalBucket);
		}
	};

	// Monitor DOM changes and adjust bucket type
	useEffect(() => {
		if (!isAutoMode) return;

		// Clear existing timer
		if (adjustmentTimerRef.current) {
			clearTimeout(adjustmentTimerRef.current);
		}

		// Delay adjustment to allow chart to render
		adjustmentTimerRef.current = setTimeout(() => {
			adjustBucketTypeBasedOnLabels();
		}, 500);

		// Setup MutationObserver to watch for chart updates
		const observer = new MutationObserver(() => {
			if (adjustmentTimerRef.current) {
				clearTimeout(adjustmentTimerRef.current);
			}
			adjustmentTimerRef.current = setTimeout(() => {
				adjustBucketTypeBasedOnLabels();
			}, 300);
		});

		if (chartContainerRef.current) {
			observer.observe(chartContainerRef.current, {
				childList: true,
				subtree: true,
				characterData: false,
			});
		}

		return () => {
			observer.disconnect();
			if (adjustmentTimerRef.current) {
				clearTimeout(adjustmentTimerRef.current);
			}
		};
	}, [isAutoMode, autoBucketType]);

	// Handle chart selection/zoom event — persist customStart/customEnd
	const handleChartSelection = useCallback((chartContext, { xaxis }) => {
		if (!xaxis || !xaxis.min || !xaxis.max) return;

		try {
			// Get selected date range from xaxis
			const minDate = new Date(xaxis.min);
			const maxDate = new Date(xaxis.max);

			// Update custom date range — these persist
			setCustomStart(minDate);
			setCustomEnd(maxDate);

			// Switch to custom range mode
			setTimeRange("custom");

			// Switch to manual mode
			setIsAutoMode(false);

			// Close any open pickers
			setShowDatePicker(false);
			setShowRangePicker(false);
		} catch (err) {
			console.error("Error handling chart selection:", err);
		}
	}, []);

	// Format time labels based on bucket type
	const formatTimeLabel = (dateStr, bucket) => {
		const date = new Date(dateStr);

		if (bucket === "day") {
			// Show date for day view
			return date.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
			});
		} else if (bucket === "2hour") {
			// Show time for 2hour (e.g., "8am", "10am")
			return date.toLocaleTimeString("en-GB", {
				hour: "numeric",
				hour12: true,
			});
		} else if (bucket === "hour") {
			// Show hour (e.g., "8am", "9am")
			return date.toLocaleTimeString("en-GB", {
				hour: "numeric",
				hour12: true,
			});
		} else if (bucket === "30min") {
			// Show time with minutes (e.g., "8:00am", "8:30am")
			return date.toLocaleTimeString("en-GB", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		} else if (bucket === "15min") {
			// Show time with minutes (e.g., "8:15am", "8:30am")
			return date.toLocaleTimeString("en-GB", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		}
		return dateStr;
	};

	const prepareChartData = () => {
		if (!trendData || !trendData.dailyData) {
			return {
				categories: [],
				series: [],
			};
		}

		const dailyData = trendData.dailyData;
		const currentBucket = isAutoMode ? autoBucketType : bucketType;

		const categories = dailyData.map((d) =>
			formatTimeLabel(d.date, currentBucket)
		);

		const series = [
			{
				name: "Emotional Score",
				data: dailyData.map((d) => Math.round(d.avgScore)),
				color: "#4318FF",
			},
			{
				name: "Confidence",
				data: dailyData.map((d) => Math.round(d.avgConfidence * 100)),
				color: "#6AD2FF",
			},
		];

		return { categories, series };
	};

	const chartData = prepareChartData();
	const currentBucket = isAutoMode ? autoBucketType : bucketType;

	const options = {
		legend: {
			show: false,
		},
		theme: {
			mode: "light",
		},
		chart: {
			type: "line",
			toolbar: {
				show: false,
			},
			selection: {
				enabled: true,
				xaxis: {
					min: undefined,
					max: undefined,
				},
			},
			events: {
				selection: handleChartSelection,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			curve: "smooth",
		},
		tooltip: {
			style: {
				fontSize: "12px",
				fontFamily: undefined,
				backgroundColor: "#000000"
			},
			theme: 'light',
			x: {
				formatter: (value, { series, seriesIndex, dataPointIndex }) => {
					if (trendData?.dailyData && trendData.dailyData[dataPointIndex]) {
						const dateStr = trendData.dailyData[dataPointIndex].date;
						const date = new Date(dateStr);

						if (currentBucket === "day") {
							return date.toLocaleDateString("en-GB", {
								weekday: "short",
								year: "numeric",
								month: "short",
								day: "numeric",
							});
						} else {
							return date.toLocaleString("en-GB", {
								weekday: "short",
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								hour12: true,
							});
						}
					}
					return value;
				},
			},
		},
		grid: {
			show: false,
			padding: {
				top: 0,
				bottom: 0,
				left: 30,
				right: 30
			}
		},
		xaxis: {
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			labels: {
				style: {
					colors: "#A3AED0",
					fontSize: "12px",
					fontWeight: "500",
				},
				hideOverlappingLabels: true,
			},
			type: "text",
			range: undefined,
			categories: chartData.categories,
		},
		yaxis: {
			show: false
		},
	};

	const handleTimeRangeChange = useCallback((range) => {
		setTimeRange(range);
		setShowDatePicker(false);
	}, []);

	const handleBucketTypeChange = useCallback((type) => {
		setIsAutoMode(false);
		setBucketType(type);
		setShowRangePicker(false);
	}, []);

	const handleAutoMode = useCallback(() => {
		setIsAutoMode(prev => !prev);
		setShowRangePicker(false);
	}, []);

	return (
		<Card extra="!p-[20px] text-center col-span-1 ">
			<div className="flex justify-between items-center">
				<div className="relative">
					<button
						onClick={() => setShowDatePicker(!showDatePicker)}
						className="linear mt-1 flex items-center justify-center gap-2 mb-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
					>
						<MdOutlineCalendarToday />
						<span className="text-sm font-medium text-gray-600">
							{timeRange === "thisMonth" && "This Month"}
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
							<button
								onClick={() => handleTimeRangeChange("custom")}
								className="btn-submit mt-3"
							>
								Apply
							</button>
						</div>
					)}
				</div>
				<div className="relative">
					<button
						onClick={() => setShowRangePicker(!showRangePicker)}
						className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200"
					>
						<MdBarChart className="h-6 w-6" />
					</button>

					{showRangePicker && (
						<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[180px]">
							<div className="mb-2">
								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={isAutoMode}
										onChange={handleAutoMode}
										className="w-4 h-4"
									/>
									<span className="font-semibold">Auto Adjust</span>
								</label>
								<p className="text-xs text-gray-500 ml-6">
									{isAutoMode && `Current: ${autoBucketType}`}
								</p>
							</div>

							<hr className="my-2" />

							<p className="text-sm font-semibold mb-2">Manual Range</p>
							<button
								onClick={() => handleBucketTypeChange("day")}
								className={`block w-full text-left px-3 py-1 rounded mb-1 text-sm ${!isAutoMode && bucketType === "day"
									? "bg-brand-500 text-white"
									: "hover:bg-gray-100"
									}`}
								disabled={isAutoMode}
							>
								Per Day
							</button>
							<button
								onClick={() => handleBucketTypeChange("2hour")}
								className={`block w-full text-left px-3 py-1 rounded mb-1 text-sm ${!isAutoMode && bucketType === "2hour"
									? "bg-brand-500 text-white"
									: "hover:bg-gray-100"
									}`}
								disabled={isAutoMode}
							>
								Per 2 Hours
							</button>
							<button
								onClick={() => handleBucketTypeChange("hour")}
								className={`block w-full text-left px-3 py-1 rounded mb-1 text-sm ${!isAutoMode && bucketType === "hour"
									? "bg-brand-500 text-white"
									: "hover:bg-gray-100"
									}`}
								disabled={isAutoMode}
							>
								Per Hour
							</button>
							<button
								onClick={() => handleBucketTypeChange("30min")}
								className={`block w-full text-left px-3 py-1 rounded mb-1 text-sm ${!isAutoMode && bucketType === "30min"
									? "bg-brand-500 text-white"
									: "hover:bg-gray-100"
									}`}
								disabled={isAutoMode}
							>
								Per 30 Minutes
							</button>
							<button
								onClick={() => handleBucketTypeChange("15min")}
								className={`block w-full text-left px-3 py-1 rounded text-sm ${!isAutoMode && bucketType === "15min"
									? "bg-brand-500 text-white"
									: "hover:bg-gray-100"
									}`}
								disabled={isAutoMode}
							>
								Per 15 Minutes
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
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
									<p className="text-sm font-bold text-green-500">
										+{trendData.trendPercentage}%
									</p>
								</>
							)}
							{trendData?.trendDirection === "down" && (
								<>
									<MdArrowDropDown className="font-medium text-red-500" />
									<p className="text-sm font-bold text-red-500">
										{trendData.trendPercentage}%
									</p>
								</>
							)}
							{trendData?.trendDirection === "stable" && (
								<p className="text-sm font-bold text-gray-500">No change</p>
							)}
						</div>
					</div>
				</div>
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
