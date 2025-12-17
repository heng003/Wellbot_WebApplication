import React, { useState, useEffect, useMemo } from "react";
import PieChart from "../charts/PieChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useInterventionData } from "../../hooks/useInterventionData";

const ReportPieChartCard = ({ startDate, endDate, userId: propUserId }) => {
    const userId = propUserId || getIdFromToken();

    const customRange = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);
    const stableRefDate = useMemo(() => new Date(), []);

    const { data: rawData, loading } = useInterventionData(
        userId,
        "custom",
        stableRefDate,
        customRange
    );

    const [chartData, setChartData] = useState([]);
    const [chartOptions, setChartOptions] = useState(basePieOptions);
    const [distribution, setDistribution] = useState([]);

    // 1. Define Fixed Color Mapping and Order
    const COLOR_MAP = useMemo(() => ({
        "Support Chat": "#519AF6",
        "Journaling": "#69D5C5",
        "Gratitude": "#EA5E8F",
        "Meditation with Music": "#FF9F68",
        "Daily Quote": "#FFD56B"
    }), []);

    // Create an ordered list of keys to enforce chart sequence
    const FIXED_ORDER = useMemo(() => [
        "Support Chat",
        "Journaling",
        "Gratitude",
        "Meditation with Music",
        "Daily Quote"
    ], []);

    useEffect(() => {
        if (!Array.isArray(rawData)) return;

        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();
        const counts = {};

        rawData.forEach(log => {
            if (!log.timestamp) return;
            const logTime = new Date(log.timestamp).getTime();

            if (logTime >= startTime && logTime <= endTime) {
                const type = log.intervention_type || "Unknown";
                counts[type] = (counts[type] || 0) + 1;
            }
        });

        const orderedSeries = [];
        const orderedLabels = [];
        const orderedColors = [];

        FIXED_ORDER.forEach(type => {
            if (counts[type] > 0) {
                orderedSeries.push(counts[type]);
                orderedLabels.push(type);
                orderedColors.push(COLOR_MAP[type]);
            }
        });

        // Handle "Unknown" types if any exist (append to end)
        Object.keys(counts).forEach(type => {
            if (!FIXED_ORDER.includes(type) && counts[type] > 0) {
                orderedSeries.push(counts[type]);
                orderedLabels.push(type);
                orderedColors.push("#A3AED0"); // Default gray
            }
        });

        setChartData(orderedSeries);
        setChartOptions(prev => ({
            ...prev,
            labels: orderedLabels,
            colors: orderedColors,
            fill: { colors: orderedColors }
        }));

        const total = orderedSeries.reduce((a, b) => a + b, 0);

        const allPresentKeys = Object.keys(counts);

        const distData = allPresentKeys.map(label => ({
            label,
            count: counts[label],
            percentage: total > 0 ? Math.round((counts[label] / total) * 100) : 0,
            color: COLOR_MAP[label] || "#A3AED0"
        }));

        // Sort descending by count for the list
        setDistribution(distData.sort((a, b) => b.count - a.count));

    }, [rawData, startDate, endDate, COLOR_MAP, FIXED_ORDER]);

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

                            <div className="col-span-1 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            </div>

                            <div className="col-span-7 pl-2 overflow-hidden flex items-center">
                                <p className="text-md font-normal text-gray-800 truncate leading-8" title={item.label}>
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