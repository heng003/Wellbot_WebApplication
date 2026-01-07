import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "../card";
import BarChart from "../charts/BarChart";
import HoverTooltip from "../../components/HoverTooltip";
import { getIdFromToken } from "../../utils/auth";
import { useSocketSubscription } from "../../hooks/useSocket";

const EmotionalDistribution = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const currentUserId = getIdFromToken();
	const targetUserId = propUserId || currentUserId;

	// Check mode: Controlled (props provided) vs Uncontrolled (internal state)
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	const [customStart, setCustomStart] = useState(null);
	const [customEnd, setCustomEnd] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Helper: Get default "This Month" range
	const getDefaultRange = () => {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
		return { start, end: now };
	};

	// Internal state for date range (The actual range used for fetching)
	// Initialized directly to default or props to avoid needing getDateRange
	const [dateRange, setDateRange] = useState(() => {
		if (isControlled) {
			return { start: propStartDate, end: propEndDate };
		}
		return getDefaultRange();
	});

	const [dailyCounts, setDailyCounts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Pagination state
	const maxWindow = 10;
	const [startIndex, setStartIndex] = useState(0);

	// --- SYNC PROPS (Controlled Mode) ---
	useEffect(() => {
		if (isControlled) {
			setDateRange({ start: propStartDate, end: propEndDate });
		}
	}, [propStartDate, propEndDate, isControlled]);

	const formatLocalDate = (d) => {
		if (!d || !(d instanceof Date)) return "";
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	};

	const fetchCounts = async (start, end) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const startStr = formatLocalDate(start);
			const endStr = formatLocalDate(end);

			const res = await axios.get(
				`/api/emotion/getCountsByDate/${targetUserId}?startDate=${startStr}&endDate=${endStr}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const payload = res.data || {};
			const counts = Array.isArray(payload.dailyCounts) ? payload.dailyCounts : [];

			counts.sort((a, b) => new Date(a.day) - new Date(b.day));

			setDailyCounts(counts);

			setStartIndex(0);
		} catch (err) {
			console.error("❌ Failed to load emotion counts:", err);
			setDailyCounts([]);
			setStartIndex(0);
		} finally {
			setLoading(false);
		}
	};

	// Trigger fetch when the *Applied* dateRange changes
	useEffect(() => {
		if (dateRange.start && dateRange.end) {
			fetchCounts(dateRange.start, dateRange.end);
		}
	}, [targetUserId, dateRange.start, dateRange.end]);

	useSocketSubscription(['emotional_log'], () => {
		if (dateRange.start && dateRange.end) {
			fetchCounts(dateRange.start, dateRange.end);
		}
	});

	const shiftPage = (direction) => {
		const total = dailyCounts.length;

		setStartIndex((prevIndex) => {
			let newStartIndex;

			if (direction === "left") {
				newStartIndex = Math.max(0, prevIndex - maxWindow);
			} else {
				newStartIndex = Math.min(
					Math.max(0, total - maxWindow),
					prevIndex + maxWindow
				);
			}

			// Compute new window slice
			const windowData = dailyCounts.slice(
				newStartIndex,
				newStartIndex + maxWindow
			);

			if (windowData.length > 0) {
				const newStartDate = new Date(windowData[0].day);
				const newEndDate = new Date(windowData[windowData.length - 1].day);

				newStartDate.setHours(0, 0, 0, 0);
				newEndDate.setHours(23, 59, 59, 999);
				setStartIndex(newStartIndex);

				setDateRange({
					start: dateRange.start,
					end: dateRange.end,
				});
			}

			return newStartIndex;
		});
	};

	const EMOTION_KEYS = ["fear", "sad", "angry", "happy"];
	const LABELS = ["Fear", "Sad", "Angry", "Happy"];
	const COLORS = ["#519AF6", "#69D5C5", "#EA5E8F", "#FFD56B"];

	// Slicing data based on startIndex to support pagination
	const visibleData = useMemo(() => {
		return dailyCounts.slice(startIndex, startIndex + maxWindow);
	}, [dailyCounts, startIndex, maxWindow]);

	const categories = useMemo(() => {
		return visibleData.map((d) => {
			const dt = new Date(d.day);
			return dt.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
		});
	}, [visibleData]);

	const series = useMemo(() => {
		return EMOTION_KEYS.map((key, index) => ({
			name: LABELS[index],
			data: visibleData.map((d) => Number(d[key]) || 0),
		}));
	}, [visibleData]);

	const chartOptions = useMemo(() => ({
		chart: { type: "bar", stacked: true, toolbar: { show: false } },
		tooltip: { style: { fontSize: "12px", backgroundColor: "#000" }, theme: "dark" },
		xaxis: {
			categories,
			show: false,
			labels: { show: true, style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } },
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: { show: false },
		grid: { borderColor: "rgba(163, 174, 208, 0.3)", padding: { left: 30, right: 30 }, show: true, yaxis: { lines: { show: false } } },
		fill: { type: "solid", colors: COLORS },
		colors: COLORS,
		legend: { show: false },
		dataLabels: { enabled: false },
		plotOptions: { bar: { borderRadius: 10, columnWidth: "20px" } },
	}), [categories, COLORS]); // Re-calculate options when categories change (shiftPage)

	const canPageLeft = startIndex > 0;
	const canPageRight = startIndex + maxWindow < dailyCounts.length;

	const handleApplyCustomRange = () => {
		if (customStart && customEnd) {
			setDateRange({ start: customStart, end: customEnd });
		}

		setShowDatePicker(false);
	};

	const hasData = useMemo(() => {
		if (!dailyCounts || dailyCounts.length === 0) return false;
		return dailyCounts.some(day => {
			return EMOTION_KEYS.reduce((sum, key) => sum + (Number(day[key]) || 0), 0) > 0;
		});
	}, [dailyCounts]);

	return (
		<Card extra="!p-[20px] text-center col-span-1">
			<div className="mb-auto flex items-center justify-between px-3">
				<HoverTooltip content="Frequency of each emotion recorded by date">
					<h2 className="text-lg font-bold text-navy-700">Emotional Distribution</h2>
				</HoverTooltip>

				{/* Only show controls if NOT controlled */}
				{!isControlled ? (
					<div className="flex items-center gap-2">
						<button onClick={() => shiftPage("left")} disabled={!canPageLeft} className={`px-2 py-1 rounded ${canPageLeft ? "bg-gray-200 hover:bg-gray-100" : "bg-gray-100 opacity-50"}`}>◀</button>
						<button onClick={() => shiftPage("right")} disabled={!canPageRight} className={`px-2 py-1 rounded ${canPageRight ? "bg-gray-200 hover:bg-gray-100mo" : "bg-gray-100 opacity-50"}`}>▶</button>
						<div className="relative">
							<HoverTooltip content="Select custom date range">
								<button onClick={() => setShowDatePicker(!showDatePicker)} className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100">
									<MdOutlineCalendarToday className="h-5 w-5" />
								</button>
							</HoverTooltip>
							{showDatePicker && (
								<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[200px] text-sm text-align-left">
									<p className="font-semibold mb-2">Date Range</p>
									<div>
										<div className="flex flex-col justify-content-start">
											<label className="text-xs text-gray-500">From</label>
											<input
												type="date"
												value={customStart ? formatLocalDate(customStart) : ""}
												onChange={(e) => setCustomStart(new Date(e.target.value))}
												className="border rounded p-1"
											/>
										</div>
										<div className="flex flex-col justify-content-start">
											<label className="text-xs text-gray-500">To</label>
											<input
												type="date"
												value={customEnd ? formatLocalDate(customEnd) : ""}
												onChange={(e) => setCustomEnd(new Date(e.target.value))}
												className="border rounded p-1"
											/>
										</div>
										<button
											onClick={handleApplyCustomRange}
											className="w-full bg-brand-500 text-white rounded py-1 mt-2 hover:bg-brand-600 transition"
										>
											Apply
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<button onClick={() => shiftPage("left")} disabled={!canPageLeft} className={`px-2 py-1 rounded ${canPageLeft ? "bg-gray-200" : "bg-gray-100 opacity-50"}`}>◀</button>
						<button onClick={() => shiftPage("right")} disabled={!canPageRight} className={`px-2 py-1 rounded ${canPageRight ? "bg-gray-200" : "bg-gray-100 opacity-50"}`}>▶</button>
					</div>
				)}
			</div>

			<div>
				<div className="min-h-[200px] w-full">
					{loading ? (
						<div className="flex h-full items-center justify-center">
							<p className="text-gray-400 animate-pulse">Loading data...</p>
						</div>
					) : hasData ? (
						<BarChart chartData={series} chartOptions={chartOptions} height={"270px"} />
					) : (
						<div className="flex h-full items-center justify-center rounded-lg">
							<p className="text-gray-400">No data available for this period</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default EmotionalDistribution;