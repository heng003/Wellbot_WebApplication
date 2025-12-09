import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "../card";
import BarChart from "../charts/BarChart";
import { getIdFromToken } from "../../utils/auth";

const EmotionalDistribution = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const currentUserId = getIdFromToken();
	const targetUserId = propUserId || currentUserId;

	// Check mode: Controlled (props provided) vs Uncontrolled (internal state)
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	const [timeRange, setTimeRange] = useState("thisMonth");
	const [customStart, setCustomStart] = useState(null);
	const [customEnd, setCustomEnd] = useState(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Internal state for date range
	const [dateRange, setDateRange] = useState({
		start: isControlled ? propStartDate : null,
		end: isControlled ? propEndDate : null
	});

	const [dailyCounts, setDailyCounts] = useState([]);
	const [loading, setLoading] = useState(false);

	// Pagination state
	const maxWindow = 10;
	const [startIndex, setStartIndex] = useState(0);

	// --- SYNC PROPS ---
	useEffect(() => {
		if (isControlled) {
			setDateRange({ start: propStartDate, end: propEndDate });
		}
	}, [propStartDate, propEndDate, isControlled]);

	// Calculate date range based on selection
	const getDateRange = useCallback((range = timeRange, cs = customStart, ce = customEnd) => {
		const now = new Date();
		let start, end;
		switch (range) {
			case "thisMonth":
				start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
				end = now;
				break;
			case "custom":
				start = cs ? new Date(cs) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
				end = ce ? new Date(ce) : now;
				break;
			default:
				start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
				end = now;
		}
		return { start, end };
	}, [timeRange, customStart, customEnd]);

	// Update internal date range if not controlled
	useEffect(() => {
		if (!isControlled) {
			const { start, end } = getDateRange(timeRange, customStart, customEnd);
			setDateRange({ start, end });
		}
	}, [timeRange, customStart, customEnd, getDateRange, isControlled]);

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

			// UPDATED: Handle the new response format { dailyCounts: [...] }
			const payload = res.data || {};
			const counts = Array.isArray(payload.dailyCounts) ? payload.dailyCounts : [];

			// Sort by date to ensure chart flows left-to-right
			counts.sort((a, b) => new Date(a.day) - new Date(b.day));

			setDailyCounts(counts);

			// Auto-scroll to the end (latest dates)
			const total = counts.length;
			setStartIndex(Math.max(0, total - maxWindow));
		} catch (err) {
			console.error("❌ Failed to load emotion counts:", err);
			setDailyCounts([]);
			setStartIndex(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (dateRange.start && dateRange.end) {
			fetchCounts(dateRange.start, dateRange.end);
		}
	}, [dateRange.start, dateRange.end]);

	const shiftPage = (direction) => {
		const total = dailyCounts.length;
		if (direction === "left") {
			setStartIndex((s) => Math.max(0, s - maxWindow));
		} else {
			setStartIndex((s) => Math.min(Math.max(0, total - maxWindow), s + maxWindow));
		}
	};

	// UPDATED: Match the keys returned by your API (lowercase)
	// API returns: happy, sad, angry, fear
	const EMOTION_KEYS = ["fear", "angry", "sad", "happy"];
	const LABELS = ["Fear", "Angry", "Sad", "Happy"]; // For Legend/Tooltip
	const COLORS = ["#EA5E8F", "#7E6FEE", "#69D5C5", "#519AF6"];

	const visibleData = useMemo(() => {
		return dailyCounts.slice(startIndex, startIndex + maxWindow);
	}, [dailyCounts, startIndex, maxWindow]);

	const categories = useMemo(() => {
		return visibleData.map((d) => {
			// UPDATED: Use 'day' property from API
			const dt = new Date(d.day);
			return dt.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
		});
	}, [visibleData]);

	const series = useMemo(() => {
		return EMOTION_KEYS.map((key, index) => ({
			name: LABELS[index], // Display Name
			data: visibleData.map((d) => Number(d[key]) || 0), // Data Accessor
		}));
	}, [visibleData]);

	const chartOptions = {
		chart: { type: "bar", stacked: true, toolbar: { show: false } },
		tooltip: { style: { fontSize: "12px", backgroundColor: "#000" }, theme: "dark" },
		xaxis: {
			categories,
			show: false,
			labels: { show: true, style: { colors: "#A3AED0", fontSize: "14px", fontWeight: "500" } },
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: { show: false },
		grid: { borderColor: "rgba(163, 174, 208, 0.3)", show: true, yaxis: { lines: { show: false } } },
		fill: { type: "solid", colors: COLORS },
		colors: COLORS,
		legend: { show: false },
		dataLabels: { enabled: false },
		plotOptions: { bar: { borderRadius: 10, columnWidth: "20px" } },
	};

	const canPageLeft = startIndex > 0;
	const canPageRight = startIndex + maxWindow < dailyCounts.length;

	const handleTimeRangeChange = (range) => {
		setTimeRange(range);
		setShowDatePicker(false);
	};

	return (
		<Card extra="!p-[20px] text-center col-span-1">
			<div className="mb-auto flex items-center justify-between px-3">
				<h2 className="text-lg font-bold text-navy-700">Emotional Distribution</h2>

				{/* Only show controls if NOT controlled */}
				{!isControlled ? (
					<div className="flex items-center gap-2">
						<button onClick={() => shiftPage("left")} disabled={!canPageLeft} className={`px-2 py-1 rounded ${canPageLeft ? "bg-gray-200" : "bg-gray-100 opacity-50"}`}>◀</button>
						<button onClick={() => shiftPage("right")} disabled={!canPageRight} className={`px-2 py-1 rounded ${canPageRight ? "bg-gray-200" : "bg-gray-100 opacity-50"}`}>▶</button>
						<div className="relative">
							<button onClick={() => setShowDatePicker(!showDatePicker)} className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100">
								<MdOutlineCalendarToday className="h-6 w-6" />
							</button>
							{showDatePicker && (
								<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[180px] text-sm">
									<p className="font-semibold mb-2">Date Range</p>
									<div className="flex justify-between mb-2">
										<label className="p-1">From:</label>
										<input type="date" value={customStart ? formatLocalDate(customStart) : ""} onChange={(e) => setCustomStart(new Date(e.target.value))} className="border rounded p-1 w-24" />
									</div>
									<div className="flex justify-between mb-2">
										<label className="p-1">To:</label>
										<input type="date" value={customEnd ? formatLocalDate(customEnd) : ""} onChange={(e) => setCustomEnd(new Date(e.target.value))} className="border rounded p-1 w-24" />
									</div>
									<button onClick={() => handleTimeRangeChange("custom")} className="btn-submit w-full mt-2">Apply</button>
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

			<div className="md:mt-16 lg:mt-0">
				<div className="h-[250px] w-full xl:h-[350px]">
					{loading ? (
						<div className="flex h-full items-center justify-center">
							<p className="text-gray-400">Loading data...</p>
						</div>
					) : !dailyCounts.length ? (
						<div className="flex h-full items-center justify-center">
							<p className="text-gray-400">No data available for this period</p>
						</div>
					) : (
						<BarChart chartData={series} chartOptions={chartOptions} />
					)}
				</div>
			</div>
		</Card>
	);
};

export default EmotionalDistribution;