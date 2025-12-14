import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Card from "../card";
import BarChart from "../charts/BarChart";
import { getIdFromToken } from "../../utils/auth";

const ReportBarChartCard = ({ startDate, endDate, userId: propUserId, bucketType = "day" }) => {
    const userId = propUserId || getIdFromToken();
    const [dailyCounts, setDailyCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const LABELS = ["Happy", "Sad", "Angry", "Fear"];
    const COLORS = ["#519AF6", "#69D5C5", "#7E6FEE", "#EA5E8F"];

    // --- Data Fetching ---
    useEffect(() => {
        const fetchCounts = async () => {
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
        };

        fetchCounts();
    }, [startDate, endDate, userId]);

    // --- Data Processing (Aggregation) ---
    const { chartData, chartOptions, hasData } = useMemo(() => {
        const EMOTION_KEYS = ["fear", "angry", "sad", "happy"];
        const LABELS = ["Fear", "Angry", "Sad", "Happy"];
        const COLORS = ["#EA5E8F", "#7E6FEE", "#69D5C5", "#519AF6"];

        let processedData = [];
        let categories = [];

        // Check if there is ANY data (non-zero counts) in the whole dataset
        const totalCount = dailyCounts.reduce((sum, day) => {
            const daySum = EMOTION_KEYS.reduce((s, k) => s + (Number(day[k]) || 0), 0);
            return sum + daySum;
        }, 0);

        const dataExists = totalCount > 0;

        if (bucketType === "month") {
            // Aggregate Daily -> Monthly
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
                show: false,
                labels: { show: true, style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: { show: false },
            grid: { show: false, padding: { left: 30, right: 30 } },
            fill: { type: "solid", colors: COLORS },
            colors: COLORS,
            legend: { show: false },
            dataLabels: { enabled: false },
            plotOptions: { bar: { borderRadius: 10, columnWidth: "20px" } },
        };

        return { chartData: series, chartOptions: options, hasData: dataExists };
    }, [dailyCounts, bucketType]);

    return (
        <Card extra="col-span-1 rounded-[20px] p-3 h-full">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700">Emotional Distribution</h4>
                </div>
                {hasData && (
                    <div className="flex gap-3">
                        {LABELS.map((label, i) => (
                            <div key={label} className="flex flex-row items-center gap-1 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }}></div>
                                <span className="text-xs text-gray-600 font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-[250px] w-full mt-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-400">Loading data...</p>
                    </div>
                ) : hasData ? (
                    <BarChart chartData={chartData} chartOptions={chartOptions} />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-500">No data available for this period</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ReportBarChartCard;