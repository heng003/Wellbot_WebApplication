import React, { useEffect, useState, useMemo } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "axios";
import Card from "../card";
import BarChart from "../charts/BarChart";
import { getIdFromToken } from "../../utils/auth";
import { useSocketSubscription } from "../../hooks/useSocket";

const ReportBarChartCard = ({ startDate, endDate, userId: propUserId, bucketType = "day" }) => {
    const userId = propUserId || getIdFromToken();
    const [dailyCounts, setDailyCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Data Fetching ---
    const fetchCounts = React.useCallback(async () => {
        if (!startDate || !endDate || !userId) return;

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const format = (d) => {
                const date = new Date(d);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const startStr = format(startDate);
            const endStr = format(endDate);

            const res = await axios.get(
                `/api/emotion/getCountsByDate/${userId}?startDate=${startStr}&endDate=${endStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const payload = res.data || {};
            const counts = Array.isArray(payload.dailyCounts) ? payload.dailyCounts : [];

            counts.sort((a, b) => new Date(a.day) - new Date(b.day));
            setDailyCounts(counts);
        } catch (err) {
            console.error("❌ Failed to load emotion counts:", err);
            setDailyCounts([]);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, userId]);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    useSocketSubscription(['emotional_log'], fetchCounts);

    // --- Data Processing (Aggregation) ---
    const { chartData, chartOptions, hasData, distribution } = useMemo(() => {
        const EMOTION_KEYS = ["fear", "sad", "angry", "happy"];
        const LABELS = ["Fear", "Sad", "Angry", "Happy"];
        const COLORS = ["#519AF6", "#69D5C5", "#EA5E8F", "#FFD56B"];

        let processedData = [];
        let categories = [];

        // 1. Calculate Totals for Distribution Legend
        const emotionTotals = {};
        let grandTotal = 0;

        dailyCounts.forEach(day => {
            EMOTION_KEYS.forEach(k => {
                const val = Number(day[k]) || 0;
                emotionTotals[k] = (emotionTotals[k] || 0) + val;
                grandTotal += val;
            });
        });

        const dataExists = grandTotal > 0;

        // 2. Prepare Distribution List (Sorted by count)
        const distData = EMOTION_KEYS.map((key, index) => ({
            label: LABELS[index],
            color: COLORS[index],
            count: emotionTotals[key] || 0,
            percentage: grandTotal > 0 ? Math.round(((emotionTotals[key] || 0) / grandTotal) * 100) : 0
        }));

        distData.sort((a, b) => b.count - a.count);

        // 3. Prepare Chart Data
        if (bucketType === "month") {
            const monthlyMap = new Map();
            dailyCounts.forEach(day => {
                const date = new Date(day.day);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyMap.has(key)) {
                    monthlyMap.set(key, {
                        date: date,
                        happy: 0, sad: 0, angry: 0, fear: 0
                    });
                }

                const entry = monthlyMap.get(key);
                EMOTION_KEYS.forEach(k => {
                    entry[k] += Number(day[k]) || 0;
                });
            });

            processedData = Array.from(monthlyMap.values());
            categories = processedData.map(d => d.date.toLocaleString('default', { month: 'short', year: 'numeric' }));
        } else {
            processedData = dailyCounts;
            categories = processedData.map(d => {
                const date = new Date(d.day);
                return date.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' });
            });
        }

        const series = EMOTION_KEYS.map((key, index) => ({
            name: LABELS[index],
            data: processedData.map((d) => d[key]),
        }));

        const options = {
            chart: { type: "bar", stacked: true, toolbar: { show: false } },
            tooltip: { theme: "dark" },
            xaxis: {
                categories,
                show: true,
                labels: { show: true, style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: { show: false },
            grid: { show: false },
            fill: { type: "solid", colors: COLORS },
            colors: COLORS,
            legend: { show: false },
            dataLabels: { enabled: false },
            plotOptions: { bar: { borderRadius: 4, columnWidth: "20px" } },
        };

        return { chartData: series, chartOptions: options, hasData: dataExists, distribution: distData };
    }, [dailyCounts, bucketType]);

    return (
        <Card extra="col-span-1 rounded-[20px] p-3 h-full">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700">Emotional Distribution</h4>
                </div>
            </div>

            <div className="min-h-[250px] w-full mt-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                    </div>
                ) : hasData ? (
                    <BarChart height={"320px"} chartData={chartData} chartOptions={chartOptions} />
                ) : (
                    <div className="flex min-h-[200px] h-full items-center justify-center">
                        <p className="text-sm text-gray-500">No data available for this period</p>
                    </div>
                )}
            </div>

            {hasData && (
                <div className="mt-2 rounded-2xl py-3 overflow-y-auto">
                    {distribution.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 items-center mb-1 px-2 py-2 min-h-[40px] border-b border-transparent">
                            {/* Color Indicator */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            </div>

                            {/* Label */}
                            <div className="col-span-7 pl-2 overflow-hidden flex items-center">
                                <p className="text-md font-normal text-gray-800 truncate leading-8" title={item.label}>
                                    {item.label}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="col-span-4 flex justify-end items-center gap-2 whitespace-nowrap">
                                <p className="text-sm font-bold text-navy-700">{item.percentage}%</p>
                                <p className="text-xs text-gray-400 w-8 text-right">({item.count})</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default ReportBarChartCard;