import React, { useState, useMemo } from "react";
import BarChart from "../charts/BarChart";
import { MdOutlineCalendarToday } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData, formatLocalDate, getStartEndDate } from "../../hooks/useInterventionData";
import HoverTooltip from "../../components/HoverTooltip";

const DailyTraffic = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const userId = propUserId || getIdFromToken();
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	// --- State ---
	const [timeRange, setTimeRange] = useState("monthly");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [referenceDate, setReferenceDate] = useState(new Date());
	const [tempInput, setTempInput] = useState("");

	const customRange = useMemo(() => {
		if (isControlled && propStartDate && propEndDate) {
			return { start: propStartDate, end: propEndDate };
		}
		return null;
	}, [isControlled, propStartDate, propEndDate]);

	// --- Data Fetching ---
	// If controlled, pass customRange. If not, pass timeRange/referenceDate.
	const { data: rawData, loading } = useInterventionData(
		userId,
		isControlled ? "custom" : timeRange,
		referenceDate,
		customRange
	);

	// --- Process Data for Chart ---
	const { series, chartOptions, totalActivity } = useMemo(() => {
		const categories = [];
		const counts = [];

		// 1. Determine Chart Categories (Buckets)
		// If controlled or custom, we might just show the days in the range
		// For simplicity, we'll map the raw data dates found or generate range

		// Helper: Create a map of Date -> Count
		const countMap = {};
		rawData.forEach(item => {
			const key = item.timestamp.split('T')[0]; // YYYY-MM-DD
			countMap[key] = (countMap[key] || 0) + 1;
		});

		// Generate Labels (X-Axis) based on Date Range
		let start, end;

		if (isControlled) {
			start = new Date(propStartDate);
			end = new Date(propEndDate);
		} else {
			const rangeData = getStartEndDate(referenceDate, timeRange);
			start = rangeData.start;
			end = rangeData.end;
		}

		const today = new Date();
		today.setHours(23, 59, 59, 999);
		if (end > today) {
			end = today;
		}

		// Iterate through days to build chart
		const iter = new Date(start);
		while (iter <= end) {
			const key = formatLocalDate(iter);
			// Label: DD/MM
			const label = iter.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
			categories.push(label);
			counts.push(countMap[key] || 0);
			iter.setDate(iter.getDate() + 1);
		}

		const total = counts.reduce((a, b) => a + b, 0);

		const options = {
			chart: { toolbar: { show: false } },
			tooltip: { theme: "dark" },
			xaxis: {
				categories,
				show: false,
				labels: { show: true, style: { colors: "#A3AED0", fontSize: "12px" } },
				axisBorder: { show: false },
				axisTicks: { show: false }
			},
			yaxis: { show: false },
			grid: { show: false, padding: { left: 20, right: 20 } },
			fill: {
				type: "gradient",
				gradient: {
					type: "vertical",
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					colorStops: [
						[{ offset: 0, color: "#3E9389", opacity: 1 }, { offset: 100, color: "#3E9389", opacity: 0.3 }]
					]
				}
			},
			dataLabels: { enabled: false },
			plotOptions: { bar: { borderRadius: 10, columnWidth: "25px" } }
		};

		return {
			series: [{ name: "Activity Frequency", data: counts, color: "#3E9389" }],
			chartOptions: options,
			totalActivity: total
		};
	}, [rawData, isControlled, propStartDate, propEndDate, timeRange]);

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

	return (
		<Card extra="col-span-1 p-[20px]">
			<div className="flex flex-row justify-between items-start ml-1 pt-2">
				<div>
					<div className="text-lg font-bold text-navy-700">
						<HoverTooltip content="Total count of completed wellness activities">
							Activities Completed
						</HoverTooltip>
					</div>
					{loading ? "..." : totalActivity > 0 &&
						<div className="text-[34px] font-bold text-navy-700">
							{totalActivity}
						</div>}
				</div>

				{/* Hide Controls if Controlled */}
				{!isControlled && (
					<div className="flex items-center justify-center gap-3">
						<HoverTooltip content="Customize to montly or weekly view">
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="flex items-center justify-center text-sm font-bold text-gray-600 bg-transparent border-none outline-none"
							>
								<option value="weekly">Weekly</option>
								<option value="monthly">Monthly</option>
							</select>
						</HoverTooltip>
						<div className="relative">
							<HoverTooltip content="Select custom date range">
								<button onClick={() => setShowDatePicker(!showDatePicker)} className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-[#3E9389] hover:bg-gray-100">
									<MdOutlineCalendarToday className="h-5 w-5" />
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
											className="rounded-lg bg-[#3E9389] px-3 py-1 text-white hover:bg-[#88BFB9]"
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

			<div className="h-[220px] w-full">
				{loading ? (
					<div className="flex h-full items-center justify-center">
						<AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
					</div>
				) : totalActivity > 0 ? (
					<BarChart height="210px" chartData={series} chartOptions={chartOptions} />
				) : (
					<div className="h-full w-full flex items-center justify-center">
						<p className="text-sm text-gray-500">No data available for this period</p>
					</div>
				)}
			</div>
		</Card>
	);
};

export default DailyTraffic;