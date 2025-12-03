import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { MdOutlineCalendarToday } from "react-icons/md";
import Card from "../card";
import BarChart from "../charts/BarChart";
import { getIdFromToken } from "../../utils/auth";

const EmotionalDistribution = () => {
    const [timeRange, setTimeRange] = useState("");
    const [customStart, setCustomStart] = useState(null);
    const [customEnd, setCustomEnd] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    // Store dates as simple strings or numbers to prevent object reference issues
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    
    const [dailyCounts, setDailyCounts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // REMOVED: categories and series state (calculated on the fly now)
    
    const maxWindow = 10;
    const [startIndex, setStartIndex] = useState(0);

    const today = new Date();

    // Wrapped in useCallback to prevent recreation on every render
    const getDateRange = useCallback((range = timeRange, cs = customStart, ce = customEnd) => {
        const now = new Date();
        let start, end;

        switch (range) {
            case "custom":
                start = cs
                    ? new Date(cs.getFullYear(), cs.getMonth(), cs.getDate(), 0, 0, 0, 0)
                    : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                end = ce
                    ? new Date(ce.getFullYear(), ce.getMonth(), ce.getDate(), 23, 59, 59, 999)
                    : now;
                break;
            default:
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9, 0, 0, 0, 0);
                end = now;
        }

        return { start, end };
    }, [timeRange, customStart, customEnd]);

    useEffect(() => {
        const { start, end } = getDateRange(timeRange, customStart, customEnd);
        setDateRange({ start, end });
    }, [getDateRange]); // Dependency is now the memoized function

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
            const userId = getIdFromToken();

            const startStr = formatLocalDate(start);
            const endStr = formatLocalDate(end);

            const res = await axios.get(
                `/api/emotion/getCountsByDate/${userId}?startDate=${startStr}&endDate=${endStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const payload = res.data || {};
            const counts = Array.isArray(payload.dailyCounts) ? payload.dailyCounts : [];

            counts.sort((a, b) => new Date(a.date) - new Date(b.date));
            setDailyCounts(counts);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange.start, dateRange.end]); 

    const EMOTIONS = ["FEAR", "ANGRY", "SAD", "HAPPY"];
    const COLORS = [
        "var(--fear-color)",
        "var(--angry-color)",
        "var(--sad-color)",
        "var(--happy-color)",
    ];

    // --- FIX: CALCULATE DATA DIRECTLY WITH useMemo (No useEffect, No useState) ---
    
    // 1. Calculate the visible slice
    const visible = useMemo(() => {
        return dailyCounts.slice(startIndex, startIndex + maxWindow);
    }, [dailyCounts, startIndex, maxWindow]);

    // 2. Derive categories from visible slice
    const categories = useMemo(() => {
        return visible.map((d) => {
            const dt = new Date(d.date);
            return dt.toLocaleDateString("en-GB");
        });
    }, [visible]);

    // 3. Derive series from visible slice
    const series = useMemo(() => {
        return EMOTIONS.map((label) => ({
            name: label,
            data: visible.map((d) => d[label] || 0),
        }));
    }, [visible]); // Only recalculate if 'visible' changes

    const chartOptions = {
        chart: { type: "bar", stacked: true, toolbar: { show: false } },
        tooltip: {
            style: { fontSize: "12px", backgroundColor: "#000" },
            theme: "dark",
        },
        xaxis: {
            categories, // Uses the calculated variable
            show: false,
            labels: {
                show: true,
                style: { colors: "#A3AED0", fontSize: "14px", fontWeight: "500" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        grid: {
            borderColor: "rgba(163, 174, 208, 0.3)",
            show: true,
            yaxis: { lines: { show: false } },
			padding: {
				top: 0,
				bottom: 0,
				left: 30,
				right: 30
			}
        },
        fill: { type: "solid", colors: COLORS },
        colors: COLORS,
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: { bar: { borderRadius: 10, columnWidth: "20px" } },
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        setShowDatePicker(false);
    };

    return (
        <Card extra="!p-[20px] text-center col-span-1">
            <div className="mb-auto flex items-center justify-between px-6">
                <h2 className="text-lg font-bold text-navy-700">Emotional Distribution</h2>

                <div className="flex items-center gap-2">
					<div className="relative">
						<button
							onClick={() => setShowDatePicker(!showDatePicker)}
							className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100"
						>
							<MdOutlineCalendarToday className="h-6 w-6" />
						</button>

						{/* date picker */}
						{showDatePicker && (
							<div className="absolute right-0 bg-white border rounded-lg shadow-lg p-3 z-10 text-black min-w-[180px] text-sm">
								<p className="font-semibold mb-2">Date Range</p>

								<div className="flex justify-between">
									<label className="p-1">From:</label>
									<input
										type="date"
										value={customStart ? formatLocalDate(customStart) : ""}
										max={
											customStart
												? formatLocalDate(new Date(customStart.getTime() + 10 * 24 * 60 * 60 * 1000))
												: formatLocalDate(today)
										}
										onChange={(e) => {
											if (e && e.target && e.target.value) {
												const [y, m, d] = e.target.value.split("-");
												setCustomStart(new Date(Number(y), Number(m) - 1, Number(d)));
											}
										}}
										className="border rounded p-1"
									/>
								</div>

								<div className="flex justify-between">
									<label className="p-1">To:</label>
									<input
										type="date"
										value={customEnd ? formatLocalDate(customEnd) : ""}
										min={
											customStart
												? formatLocalDate(new Date(customStart.getTime() - 10 * 24 * 60 * 60 * 1000))
												: ""
										}
										max={
											customStart
												? formatLocalDate(new Date(customStart.getTime() + 10 * 24 * 60 * 60 * 1000))
												: formatLocalDate(today)
										}
										onChange={(e) => {
											if (e && e.target && e.target.value) {
												const [y, m, d] = e.target.value.split("-");
												setCustomEnd(new Date(Number(y), Number(m) - 1, Number(d)));
											}
										}}
										className="border rounded p-1"
									/>
								</div>

								<div className="mt-3 flex gap-2">
									<button
										onClick={() => handleTimeRangeChange("custom")}
										className="btn-submit"
									>
										Apply
									</button>
								</div>
							</div>
						)}
					</div>
                </div>
            </div>

            <div className="md:mt-16 lg:mt-0">
                <div className="h-[250px] w-full xl:h-[350px]">
                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : !dailyCounts.length ? (
                        <div className="text-gray-400 text-center py-8">
                            <p>No data available for this period</p>
                            <p className="text-xs mt-2">Range: {formatLocalDate(dateRange.start)} to {formatLocalDate(dateRange.end)}</p>
                        </div>
                    ) : !visible.length ? (
                        <p className="text-gray-400 text-center py-8">No data in current view</p>
                    ) : (
                        <BarChart chartData={series} chartOptions={chartOptions} />
                    )}
                </div>
            </div>
        </Card>
    );
};

export default EmotionalDistribution;