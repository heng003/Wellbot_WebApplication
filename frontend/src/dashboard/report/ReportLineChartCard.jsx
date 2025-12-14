import React, { useState, useEffect, useMemo } from "react";
import LineChart from "../charts/LineChart";
import Card from "../card";
import { getIdFromToken } from "../../utils/auth";
import { useEmotionalData } from "../../hooks/useEmotionalData.js";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

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

    // 4. Chart Configuration
    const options = useMemo(() => ({
        legend: { show: false },
        theme: { mode: "light" },
        chart: {
            type: "line",
            toolbar: { show: false },
            animations: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
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
        yaxis: { show: false },
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
                    <h4 className="text-lg font-bold text-navy-700">Emotional Score</h4>
                </div>
            </div>
            {hasData ? (
                <div className="flex flex-col px-3 mt-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex">
                            <div>
                                <p className="text-sm text-gray-600">Current Score</p>
                                <p className="text-3xl font-bold text-navy-700">
                                    {loading ? "..." : `${Math.round(trendData?.currentScore || 0)}`}
                                </p>
                            </div>
                            <div className="flex items-center mt-6">
                                {trendData?.trendDirection === "up" && <MdArrowDropUp className="text-green-500 h-6 w-6" />}
                                {trendData?.trendDirection === "down" && <MdArrowDropDown className="text-red-500 h-6 w-6" />}
                                <span className={`text-sm font-bold ${trendData?.trendDirection === "up" ? "text-green-500" :
                                    trendData?.trendDirection === "down" ? "text-red-500" : "text-gray-500"
                                    }`}>
                                    {trendData?.trendDirection === "stable" ? "No change" : `${trendValue}%`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-[#4318FF] shrink-0"></div>
                                <span className="text-xs text-gray-600 font-medium">Mood Score</span>
                            </div>
                            <div className="flex flex-row items-center gap-2 whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-[#6AD2FF] shrink-0"></div>
                                <span className="text-xs text-gray-600 font-medium">Confidence</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[250px] w-full">
                        {loading ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-gray-500">Loading...</p>
                            </div>
                        ) : (
                            <LineChart options={options} series={chartData.series} />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex h-[220px] w-full items-center justify-center mt-4">
                    <p className="text-sm text-gray-500">No data available for this period</p>
                </div>
            )}
        </Card>
    );
};

export default ReportLineChartCard;