import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import BarChart from "../charts/BarChart";
import { MdOutlineCalendarToday } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData, formatLocalDate, getStartEndDate } from "../../hooks/useInterventionData";
import HoverTooltip from "../../components/HoverTooltip";

const DailyTraffic = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId }) => {
	const { t } = useTranslation();
	const userId = propUserId || getIdFromToken();
	const isControlled = propStartDate !== undefined && propEndDate !== undefined;

	// --- State ---
	const [timeRange, setTimeRange] = useState("monthly");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [referenceDate, setReferenceDate] = useState(new Date());
	const [tempInput, setTempInput] = useState("");

	// Pagination State
	const MAX_WINDOW = 30;
	const [startIndex, setStartIndex] = useState(0);

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

	// Reset pagination when data source changes
	React.useEffect(() => {
		setStartIndex(0);
	}, [rawData, timeRange, referenceDate]);

	// --- Process Data for Chart ---
	const { series, chartOptions, totalActivity, canPageLeft, canPageRight } = useMemo(() => {
		const allCategories = [];
		const allCounts = [];

		// 1. Determine Chart Categories (Buckets)
		const countMap = {};
		rawData.forEach(item => {
			const key = item.timestamp.split('T')[0];
			countMap[key] = (countMap[key] || 0) + 1;
		});

		// Generate Labels
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
		if (end > today) end = today;

		const iter = new Date(start);
		while (iter <= end) {
			const key = formatLocalDate(iter);
			const label = iter.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
			allCategories.push(label);
			allCounts.push(countMap[key] || 0);
			iter.setDate(iter.getDate() + 1);
		}

		const total = allCounts.reduce((a, b) => a + b, 0);

		// --- Pagination Slice ---
		// If we have more data than MAX_WINDOW, slice it
		const visibleCategories = allCategories.slice(startIndex, startIndex + MAX_WINDOW);
		const visibleCounts = allCounts.slice(startIndex, startIndex + MAX_WINDOW);

		// --- Dynamic Column Width ---
		const dataLength = visibleCategories.length;
		let columnWidth = "70%";
		if (dataLength <= 10) columnWidth = "40px";
		else if (dataLength <= 20) columnWidth = "25px";
		else if (dataLength <= 30) columnWidth = "18px";

		const options = {
			chart: { toolbar: { show: false } },
			tooltip: { theme: "dark" },
			xaxis: {
				categories: visibleCategories,
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
			plotOptions: { bar: { borderRadius: 10, columnWidth: columnWidth } }
		};

		return {
			series: [{ name: "Activity Frequency", data: visibleCounts, color: "#3E9389" }],
			chartOptions: options,
			totalActivity: total,
			canPageLeft: startIndex > 0,
			canPageRight: startIndex + MAX_WINDOW < allCategories.length
		};
	}, [rawData, isControlled, propStartDate, propEndDate, timeRange, referenceDate, startIndex]);

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

	const handlePageChange = (direction) => {
		setStartIndex(prev => {
			if (direction === 'left') return Math.max(0, prev - MAX_WINDOW);
			if (direction === 'right') return prev + MAX_WINDOW;
			return prev;
		});
	};

	return (
		<Card extra="col-span-1 p-[20px]">
			<div className="flex flex-row justify-between items-start ml-1 pt-2">
				<div>
					<div className="text-lg font-bold text-navy-700">
						<HoverTooltip content={t('daily_traffic.tooltip_activities')}>
							{t('daily_traffic.activities_completed')}
						</HoverTooltip>
					</div>
					{loading ? "..." : totalActivity > 0 &&
						<div className="text-[34px] font-bold text-navy-700">
							{totalActivity}
						</div>}
				</div>

				<div className="flex items-center justify-center gap-3">
					{(canPageLeft || canPageRight) && (
						<div className="flex items-center bg-lightPrimary rounded-lg p-1">
							<button
								onClick={() => handlePageChange('left')}
								disabled={!canPageLeft}
								className={`p-1 rounded-md transition-colors ${!canPageLeft ? 'text-gray-300 cursor-not-allowed' : 'text-[#3E9389] hover:bg-white hover:shadow-sm'}`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							</button>
							<button
								onClick={() => handlePageChange('right')}
								disabled={!canPageRight}
								className={`p-1 rounded-md transition-colors ${!canPageRight ? 'text-gray-300 cursor-not-allowed' : 'text-[#3E9389] hover:bg-white hover:shadow-sm'}`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
								</svg>
							</button>
						</div>
					)}

					{/* Hide Controls if Controlled */}
					{!isControlled && (
						<>
							<HoverTooltip content={t('daily_traffic.tooltip_interval')}>
								<select
									value={timeRange}
									onChange={(e) => setTimeRange(e.target.value)}
									className="flex items-center justify-center text-sm font-bold text-gray-600 bg-transparent border-none outline-none"
								>
									<option value="weekly">{t('daily_traffic.weekly')}</option>
									<option value="monthly">{t('daily_traffic.monthly')}</option>
								</select>
							</HoverTooltip>
							<div className="relative">
								<HoverTooltip content={t('daily_traffic.tooltip_custom')}>
									<button onClick={() => setShowDatePicker(!showDatePicker)} className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-[#3E9389] hover:bg-gray-100">
										<MdOutlineCalendarToday className="h-5 w-5" />
									</button>
								</HoverTooltip>
								{/* Date Picker Popover */}
								{showDatePicker && (
									<div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[220px] text-sm">
										<p className="font-semibold mb-2">
											{timeRange === 'weekly' ? t('daily_traffic.select_week') : timeRange === 'monthly' ? t('daily_traffic.select_month') : t('daily_traffic.select_year')}
										</p>

										<div className="mb-3">
											{timeRange === 'weekly' && (
												<>
													<p className="text-xs text-gray-500 mb-1">{t('daily_traffic.pick_date')}</p>
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
												{t('daily_traffic.cancel')}
											</button>
											<button
												onClick={handleApplyDate}
												className="rounded-lg bg-[#3E9389] px-3 py-1 text-white hover:bg-[#88BFB9]"
											>
												{t('daily_traffic.apply')}
											</button>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
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
						<p className="text-sm text-gray-500">{t('daily_traffic.no_data')}</p>
					</div>
				)}
			</div>
		</Card >
	);
};

export default DailyTraffic;