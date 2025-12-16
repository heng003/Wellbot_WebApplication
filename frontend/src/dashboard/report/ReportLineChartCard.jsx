import React, { useState, useEffect, useMemo } from "react";
import LineChart from "../charts/LineChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useEmotionalData } from "../../hooks/useEmotionalData.js";

const ReportLineChartCard = ({ startDate, endDate, userId: propUserId, bucketType }) => {
    const userId = propUserId || getIdFromToken();

    // 1. Determine Bucket Type
    const activeBucketType = useMemo(() => {
        if (bucketType) return bucketType;

        if (!startDate || !endDate) return 'day';
        const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 60 ? 'month' : 'day';
    }, [startDate, endDate, bucketType]);

    // 2. Fetch Data
    const { trendData, loading } = useEmotionalData(startDate, endDate, activeBucketType, userId);

    const [chartData, setChartData] = useState({ categories: [], series: [] });

    // 3. Process Data for Chart
    useEffect(() => {
        if (!trendData || !Array.isArray(trendData.dailyData) || trendData.dailyData.length === 0) {
            if (!loading) setChartData({ categories: [], series: [] });
            return;
        }

        const dailyData = trendData.dailyData;

        // Format labels based on bucket type
        const categories = dailyData.map(d => {
            const date = new Date(d.date);
            if (activeBucketType === 'month') {
                return date.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
            }
            return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
        });

        const series = [
            {
                name: "Emotional Score",
                data: dailyData.map(d => Math.round(Number(d.avgScore) || 0)),
                color: "#4318FF"
            },
            {
                name: "Confidence",
                data: dailyData.map(d => Math.round((Number(d.avgConfidence) || 0) * 100)),
                color: "#6AD2FF"
            }
        ];

        setChartData({ categories, series });

    }, [trendData, activeBucketType, loading]);

    // 4. Calculate Averages
    const { avgMood, avgConf } = useMemo(() => {
        if (!trendData?.dailyData || trendData.dailyData.length === 0) return { avgMood: 0, avgConf: 0 };

        const validMoods = trendData.dailyData.filter(d => d.avgScore !== null);
        const validConfs = trendData.dailyData.filter(d => d.avgConfidence !== null);

        const totalMood = validMoods.reduce((sum, d) => sum + Number(d.avgScore), 0);
        const totalConf = validConfs.reduce((sum, d) => sum + Number(d.avgConfidence), 0);

        return {
            avgMood: validMoods.length ? Math.round(totalMood / validMoods.length) : 0,
            avgConf: validConfs.length ? Math.round((totalConf / validConfs.length) * 100) : 0
        };
    }, [trendData]);

    // 5. Chart Configuration
    const options = useMemo(() => ({
        legend: { show: false },
        theme: { mode: "light" },
        chart: {
            type: "line",
            toolbar: { show: false },
            animations: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        tooltip: {
            style: { fontSize: "12px", backgroundColor: "#000000" },
            theme: 'dark',
        },
        grid: { show: true, padding: { left: 30, right: 30 }, borderColor: "rgba(163, 174, 208, 0.3)", strokeDashArray: 5 },
        xaxis: {
            categories: chartData.categories,
            labels: {
                style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
                rotate: -45,
                hideOverlappingLabels: true
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: true, min: 0, max: 100, labels: { style: { colors: "#A3AED0", fontSize: "12px" } } },
    }), [chartData.categories]);

    // Helper to check if we actually have NON-NULL data points to show
    // We check if at least one day has a valid count > 0 or a non-null score
    const hasData = useMemo(() => {
        if (!trendData?.dailyData) return false;
        return trendData.dailyData.some(day => day.count > 0 || day.avgScore !== null);
    }, [trendData]);

    const trendValue = !isNaN(Number(trendData?.trendPercentage)) ? Number(trendData?.trendPercentage) : 0;

    return (
        <Card extra="col-span-1 rounded-[20px] p-3 h-full">
            <div className="flex flex-row justify-between px-3 pt-2">
                <div>
                    <h4 className="text-lg font-bold text-navy-700">Emotional Trends</h4>
                </div>
            </div>

            <div className="flex flex-col px-3 mt-4">
                <div className="min-h-[200px] w-full">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-gray-500">Loading...</p>
                        </div>
                    ) : hasData ? (
                        <LineChart height={"320px"} options={options} series={chartData.series} />
                    ) : (
                        <div className="flex min-h-[200px] items-center justify-center">
                            <p className="text-sm text-gray-500">No data available for this period</p>
                        </div>
                    )}
                </div>

                {hasData && (
                    <div className="mt-2 rounded-2xl py-3">
                        {/* Mood Score Legend & Avg */}
                        <div className="grid grid-cols-12 items-center mb-1 px-2 py-2 min-h-[40px] border-b border-transparent">
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div>
                            </div>
                            <div className="col-span-6 pl-2 overflow-hidden flex items-center">
                                <p className="text-md font-normal text-gray-600 truncate leading-8" title={"Mood Score"}>
                                    Mood Score
                                </p>
                            </div>
                            <div className="col-span-5 flex justify-end items-center gap-2 whitespace-nowrap">
                                <p className="text-sm font-bold text-navy-700">{avgMood}%</p>
                                <p className="text-xs text-gray-400 w-8 text-right">{"(average)"}</p>
                            </div>
                        </div>

                        {/* Confidence Legend & Avg */}
                        <div className="grid grid-cols-12 items-center mb-1 px-2 py-2 min-h-[40px] border-b border-transparent">
                            <div className="col-span-1 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#6AD2FF]"></div>
                            </div>
                            <div className="col-span-6 pl-2 overflow-hidden flex items-center">
                                <p className="text-md font-normal text-gray-600 truncate leading-8" title={"Confidence"}>
                                    Confidence
                                </p>
                            </div>
                            <div className="col-span-5 flex justify-end items-center gap-2 whitespace-nowrap">
                                <p className="text-sm font-bold text-navy-700">{avgConf}%</p>
                                <p className="text-xs text-gray-400 w-8 text-right">{"(average)"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ReportLineChartCard;