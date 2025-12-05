import React, { useState, useEffect, useCallback, useMemo } from "react";
import BarChart from "../charts/BarChart";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "../card";
import axios from "axios";
import { getIdFromToken } from "../../utils/auth";

const DailyTraffic = () => {
	const userId = getIdFromToken();
	const [timeRange, setTimeRange] = useState("weekly");
	const [series, setSeries] = useState([]);
	const [chartOptions, setChartOptions] = useState({});
	const [totalActivity, setTotalActivity] = useState(0);
	const [loading, setLoading] = useState(false);

	// --- Date Picker State ---
	const [showDatePicker, setShowDatePicker] = useState(false);
	// referenceDate acts as the anchor (e.g. the specific day in a week, the specific month, or the specific year)
	const [referenceDate, setReferenceDate] = useState(new Date());
	// Temp state for the input inside the picker before applying
	const [tempInput, setTempInput] = useState("");

	// Helper: Calculate Start and End dates based on referenceDate and timeRange
	const getStartEndDate = useCallback((refDate, range) => {
		const start = new Date(refDate);
		const end = new Date(refDate);

		// Reset time components
		start.setHours(0, 0, 0, 0);
		end.setHours(23, 59, 59, 999);

		if (range === "weekly") {
			// Calculate week range (Monday to Sunday)
			const day = start.getDay() || 7; // Convert Sunday (0) to 7 so Mon(1)..Sun(7)
			const diff = start.getDate() - day + 1;
			start.setDate(diff);
			// Set end to 6 days after start
			end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 6);
		} else if (range === "monthly") {
			// First to Last day of the month
			start.setDate(1);
			end.setMonth(start.getMonth() + 1, 0);
		} else if (range === "yearly") {
			// Jan 1st to Dec 31st
			start.setMonth(0, 1);
			end.setMonth(11, 31);
		}
		return { start, end };
	}, []);

	// Helper: Format date for the specific input type
	const formatInputDate = (date, range) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");

		if (range === "weekly") return `${yyyy}-${mm}-${dd}`; // type="date"
		if (range === "monthly") return `${yyyy}-${mm}`;     // type="month"
		if (range === "yearly") return yyyy;                 // type="number"
		return "";
	};

	// Helper: Format date in local YYYY-MM-DD
	const formatLocalDate = (d) => {
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	};

	// Initialize temp input when picker opens or range changes
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

	// --- 1. Base Chart Styles ---
	const baseOptions = useMemo(() => ({
		chart: {
			toolbar: { show: false },
		},
		tooltip: {
			style: {
				fontSize: "12px",
				fontFamily: undefined,
				backgroundColor: "#000000"
			},
			onDatasetHover: {
				style: {
					fontSize: "12px",
					fontFamily: undefined,
				},
			},
			theme: "dark",
		},
		xaxis: {
			categories: [], // Dynamic
			show: false,
			labels: {
				show: true,
				style: {
					colors: "#A3AED0",
					fontSize: "14px",
					fontWeight: "500",
				},
			},
			axisBorder: { show: false },
			axisTicks: { show: false },
		},
		yaxis: {
			show: false,
			color: "black",
			labels: {
				show: true,
				style: {
					colors: "#CBD5E0",
					fontSize: "14px",
				},
			},
		},
		grid: {
			show: false,
			strokeDashArray: 5,
			yaxis: {
				lines: { show: true },
			},
			xaxis: {
				lines: { show: false },
			},
		},
		fill: {
			type: "gradient",
			gradient: {
				type: "vertical",
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9,
				colorStops: [
					[
						{ offset: 0, color: "#4318FF", opacity: 1 },
						{ offset: 100, color: "rgba(67, 24, 255, 1)", opacity: 0.28 },
					],
				],
			},
		},
		dataLabels: { enabled: false },
		plotOptions: {
			bar: {
				borderRadius: 10,
				columnWidth: "40px",
			},
		},
	}), []);

	// --- 2. Data Processing Logic ---
	const processData = useCallback((data, range, startDate) => {
		let categories = [];
		let counts = [];

		// Helper to format date key using Local Date instead of ISO (UTC)
		const getDateKey = (date) => formatLocalDate(date);

		if (range === "weekly") {
			// Ensure we start from the Monday of the week that startDate belongs to
			const startOfWeek = new Date(startDate);
			const day = startOfWeek.getDay() || 7; // Convert Sunday (0) to 7, so Mon=1..Sun=7
			if (day !== 1) {
				// If not already Monday, subtract days to get to Monday
				startOfWeek.setDate(startOfWeek.getDate() - (day - 1));
			}

			const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
			for (let i = 0; i < 7; i++) {
				const d = new Date(startOfWeek);
				d.setDate(startOfWeek.getDate() + i);

				// Get the day name correctly
				// d.getDay() returns 0 for Sunday. 
				// We want to push the day name. 
				// Note: The loop starts from Monday.
				// i=0 (Mon), i=1 (Tue)... i=6 (Sun)
				// days array above is aligned with the loop iteration
				categories.push(days[i]);

				const key = getDateKey(d);
				const dayCount = data.filter(item => getDateKey(new Date(item.timestamp)) === key).length;
				counts.push(dayCount);
			}
		} else if (range === "monthly") {
			// Days of the specific month
			// We use startDate (1st of month) to find days in month
			const year = startDate.getFullYear();
			const month = startDate.getMonth(); // 0-indexed
			const daysInMonth = new Date(year, month + 1, 0).getDate();

			for (let i = 1; i <= daysInMonth; i++) {
				categories.push(String(i).padStart(2, '0'));

				// Construct date for this day
				const d = new Date(year, month, i);
				const key = getDateKey(d);
				const dayCount = data.filter(item => getDateKey(new Date(item.timestamp)) === key).length;
				counts.push(dayCount);
			}
		} else if (range === "yearly") {
			// Months of the specific year
			const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			categories = months;
			const year = startDate.getFullYear();

			for (let i = 0; i < 12; i++) {
				const monthCount = data.filter(item => {
					const d = new Date(item.timestamp);
					return d.getFullYear() === year && d.getMonth() === i;
				}).length;
				counts.push(monthCount);
			}
		}

		return { categories, data: counts };
	}, []);

	// --- 3. Fetching Logic ---
	const fetchData = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		try {
			const token = localStorage.getItem('token');

			// Calculate effective start/end based on referenceDate
			const { start, end } = getStartEndDate(referenceDate, timeRange);

			// Format YYYY-MM-DD using Local Date to avoid Timezone shifts
			const startStr = formatLocalDate(start);
			const endStr = formatLocalDate(end);

			const res = await axios.get(`/api/intervention/${userId}?startDate=${startStr}&endDate=${endStr}`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			const rawData = res.data?.data || res.data || [];

			// Process raw logs into chart buckets
			const { categories, data } = processData(rawData, timeRange, start);

			setSeries([{ name: "Activity Frequency", data: data }]);
			setChartOptions({
				...baseOptions,
				xaxis: {
					...baseOptions.xaxis,
					categories: categories
				}
			});

			// Sum up total for the period
			const total = data.reduce((a, b) => a + b, 0);
			setTotalActivity(total);

		} catch (err) {
			console.error("Failed to fetch daily traffic", err);
		} finally {
			setLoading(false);
		}
	}, [userId, timeRange, referenceDate, getStartEndDate, processData, baseOptions]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Label for the date picker button
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
		<Card extra="col-span-4 pb-7 p-[20px]">
			<div className="flex flex-row justify-between align-start ml-1 pt-2 px-3">
				<div>
					<p className="text-sm font-medium leading-4 text-gray-600">
						{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Activity
					</p>
					<div className="text-[34px] font-bold text-navy-700">
						{loading ? "..." : totalActivity}
						<div className="text-sm font-medium leading-6 text-gray-600">
							Interventions Completed
						</div>
					</div>
				</div>
				<div className="mb-6 flex items-center justify-center gap-2">
					<select
						value={timeRange}
						onChange={(e) => {
							setTimeRange(e.target.value);
							setReferenceDate(new Date()); // Reset to today when switching types
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

			<div className="h-[300px] w-full pt-10 pb-0">
				{!loading && series.length > 0 && (
					<BarChart
						chartData={series}
						chartOptions={chartOptions}
					/>
				)}
			</div>
		</Card>
	);
};

export default DailyTraffic;