import React, { useState, useEffect, useMemo } from "react";
import PieChart from "../charts/PieChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData } from "../../hooks/useInterventionData";

const ReportPieChartCard = ({ startDate, endDate, userId: propUserId }) => {
    const userId = propUserId || getIdFromToken();

    // Memoize the custom range object
    const customRange = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);

    // FIX: Memoize the reference date to prevent infinite re-renders
    const stableRefDate = useMemo(() => new Date(), []);

    // --- Data Fetching ---
    const { data: rawData, loading } = useInterventionData(
        userId,
        "custom",
        stableRefDate, // Use the memoized date object
        customRange
    );

    const [chartData, setChartData] = useState([]);
    const [chartOptions, setChartOptions] = useState(basePieOptions);
    const [distribution, setDistribution] = useState([]);

    const COLORS = ["#519AF6", "#69D5C5", "#7E6FEE", "#EA5E8F", "#FF9F68", "#FFD56B", "#A3AED0"];

    useEffect(() => {
        if (!Array.isArray(rawData)) return;

        // Convert timestamps for comparison
        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();

        const counts = {};

        rawData.forEach(log => {
            if (!log.timestamp) return;
            const logTime = new Date(log.timestamp).getTime();

            // Strict client-side filtering to match visual range
            if (logTime >= startTime && logTime <= endTime) {
                const type = log.intervention_type || "Unknown";
                counts[type] = (counts[type] || 0) + 1;
            }
        });

        const labels = Object.keys(counts);
        const series = Object.values(counts);
        const total = series.reduce((a, b) => a + b, 0);

        setChartData(series);
        setChartOptions(prev => ({
            ...prev,
            labels: labels,
            colors: COLORS.slice(0, labels.length),
            fill: { colors: COLORS.slice(0, labels.length) }
        }));

        const distData = labels.map((label, index) => ({
            label,
            count: counts[label],
            percentage: total > 0 ? Math.round((counts[label] / total) * 100) : 0,
            color: COLORS[index % COLORS.length]
        }));

        setDistribution(distData.sort((a, b) => b.count - a.count));

    }, [rawData, startDate, endDate]);

    return (
        <Card extra="col-span-1 rounded-[20px] p-3 h-full">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700">Activity Frequency</h4>
                </div>
            </div>

            <div className="mb-auto flex min-h-[220px] w-full items-center justify-center mt-4">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : chartData.length > 0 ? (
                    <PieChart height={"250px"} options={chartOptions} series={chartData} />
                ) : (
                    <p className="text-sm text-gray-500">No data available for this period</p>
                )}
            </div>

            {chartData.length > 0 && (
                <div className="rounded-2xl py-3">
                    {distribution.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 items-center mb-1 px-2 py-2 min-h-[40px] border-b border-transparent">

                            {/* Color Indicator (Col 1) */}
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            </div>

                            {/* Label (Col 2-8) - Truncated */}
                            <div className="col-span-7 pl-2 overflow-hidden flex items-center">
                                <p className="text-md font-normal text-gray-700 truncate leading-8" title={item.label}>
                                    {item.label}
                                </p>
                            </div>

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

export default ReportPieChartCard;

const basePieOptions = {
    chart: { width: "50px" },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: true, theme: "dark" }
};