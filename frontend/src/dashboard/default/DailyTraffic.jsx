import React, { useState, useMemo } from "react";
import BarChart from "../charts/BarChart";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData, formatLocalDate, getStartEndDate } from "../../hooks/useInterventionData";

const DailyTraffic = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const userId = propUserId || getIdFromToken();
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	// --- State ---
	const [timeRange, setTimeRange] = useState("weekly");
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

		// Iterate through days to build chart
		const iter = new Date(start);
		while (iter <= end) {
			const key = formatLocalDate(iter);
			// Label: DD/MM
			const label = `${iter.getDate()}/${iter.getMonth() + 1}`;
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
			grid: { show: false },
			fill: {
				type: "gradient",
				gradient: {
					type: "vertical",
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					colorStops: [
						[{ offset: 0, color: "#4318FF", opacity: 1 }, { offset: 100, color: "rgba(67, 24, 255, 1)", opacity: 0.3 }]
					]
				}
			},
			dataLabels: { enabled: false },
			plotOptions: { bar: { borderRadius: 10, columnWidth: "25px" } }
		};

		return {
			series: [{ name: "Activity Frequency", data: counts }],
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
		<Card extra="col-span-1 pb-7 p-[20px]">
			<div className="flex flex-row justify-between align-start ml-1 pt-2">
				<div>
					<p className="text-sm font-medium leading-4 text-gray-600">
						{isControlled ? "Activity Frequency" : `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Activity`}
					</p>
					<div className="text-[34px] font-bold text-navy-700">
						{loading ? "..." : totalActivity}
						<div className="text-sm font-medium leading-6 text-gray-600">
							Activities Completed
						</div>
					</div>
				</div>

				{/* Hide Controls if Controlled */}
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
						<div className="relative mb-3">
							<button onClick={() => setShowDatePicker(!showDatePicker)} className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100">
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
				)}
			</div>

			<div className="h-[300px] w-full pt-10 pb-0">
				{!loading && (
					<BarChart chartData={series} chartOptions={chartOptions} />
				)}
			</div>
		</Card>
	);
};

export default DailyTraffic;