import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";
import { getIdFromToken } from "../../utils/auth";
import { computeMoodActivityInsights } from "../../utils/reportUtils";
import { MdOutlineCalendarToday } from "react-icons/md";
import "../../styles/moodActivityChart.css";
import SummaryBlock from "../../components/SummaryBlock";
import HoverTooltip from "../../components/HoverTooltip";
import { useSocketSubscription } from "../../hooks/useSocket";
import BarChart from "../charts/BarChart";

const MoodActivityCorrelation = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId, onInsightsChange }) => {
    const userId = propUserId || getIdFromToken();
    const isControlled = propStartDate !== undefined && propEndDate !== undefined;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Helpers
    const getDefaultRange = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start, end: today };
    };

    const formatLocalDate = (d) => {
        if (!d || !(d instanceof Date)) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const [dateRange, setDateRange] = useState(() => {
        if (isControlled) return { start: propStartDate, end: propEndDate };
        return getDefaultRange();
    });

    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    useEffect(() => {
        if (isControlled) setDateRange({ start: propStartDate, end: propEndDate });
    }, [propStartDate, propEndDate, isControlled]);

    useEffect(() => {
        setTempStart(formatLocalDate(dateRange.start));
        setTempEnd(formatLocalDate(dateRange.end));
    }, [dateRange]);

    const fetchData = React.useCallback(async () => {
        if (!userId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const startStr = formatLocalDate(dateRange.start);
            const endStr = formatLocalDate(dateRange.end);

            const response = await axios.get(
                `/api/emotion/moodActivityCorrelation/${userId}?startDate=${startStr}&endDate=${endStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const transformedData = (response.data.correlation || []).map((item) => ({
                name: item.activity_type || "Unknown",
                avgMoodScore: Math.round(item.avg_mood_score || 0),
                moodChange: Math.round(item.mood_change || 0),
                activityCount: item.activity_count || 0,
            }));

            setData(transformedData);
            setError(null);
            if (onInsightsChange) onInsightsChange(computeMoodActivityInsights(transformedData));
        } catch (err) {
            console.error("Error fetching mood-activity correlation:", err);
            if (err.response && err.response.status !== 404) {
                setError(err.response?.data?.error || "Failed to fetch data");
            } else {
                setData([]);
            }
            if (onInsightsChange) onInsightsChange(null);
        } finally {
            setLoading(false);
        }
    }, [userId, dateRange.start, dateRange.end, onInsightsChange]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useSocketSubscription(['emotional_log', 'intervention_log'], fetchData);

    const handleApplyDate = () => {
        if (!tempStart || !tempEnd) return;
        setDateRange({ start: new Date(tempStart), end: new Date(tempEnd) });
        setShowDatePicker(false);
    };

    const getActivityColor = (activityName) => {
        const activityColors = {
            'Support Chat': '#519AF6',
            'Journaling': '#69D5C5',
            'Gratitude': '#EA5E8F',
            'Meditation with Music': '#FF9F68',
            'Daily Quote': '#FFD56B'
        };
        return activityColors[activityName] || '#3b82f6';
    };

    // --- ApexCharts Configuration ---
    const chartData = [{
        name: 'Mood Impact',
        data: data.map(d => d.moodChange === 0 ? 0.5 : d.moodChange) // Use 0.5 to make zero-impact bars visible
    }];

    const chartOptions = {
        chart: {
            toolbar: { show: false },
            fontFamily: 'Plus Jakarta Sans, sans-serif',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '40%', // thinner bars for "brief" look
                colors: {
                    ranges: [
                        { from: -100, to: -0.1, color: '#ef4444' },
                        { from: 0.1, to: 0.6, color: '#f59e0b' },   // Amber for the "zero impact" (0.5) bars
                        { from: 0.6, to: 100, color: '#10b981' }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val, opts) => {
                const originalVal = data[opts.dataPointIndex].moodChange;
                if (originalVal > 0) return `+${originalVal}`;
                if (originalVal < 0) return `${originalVal}`;
            },
            style: {
                colors: data.map(d => d.moodChange === 0 ? '#334155' : '#ffffff'),
                fontSize: '10px',
                fontWeight: 600,
            },
        },
        xaxis: {
            categories: data.map(d => d.name),
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                    fontWeight: 500
                },
                rotate: 0, // Keep flat if possible, or -45
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: { colors: '#64748b', fontSize: '12px' },
                formatter: (val) => val > 0 ? `+${val}` : `${val}`
            },
            title: {
                text: 'Mood Impact',
                style: { color: '#94a3b8', fontSize: '12px' }
            }
        },
        grid: {
            show: false,
            strokeDashArray: 3,
            borderColor: '#e2e8f0',
            xaxis: {
                lines: { show: false }
            },
            yaxis: {
                lines: { show: true }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 10
            }
        },
        tooltip: {
            y: {
                formatter: (val, { dataPointIndex }) => {
                    const originalVal = data[dataPointIndex].moodChange;
                    if (originalVal > 0) return `+${originalVal}  (Improves Mood)`;
                    if (originalVal === 0) return "Zero Impact";
                    return `${originalVal}  (Decreases Mood)`;
                }
            }
        },
        fill: { opacity: 1 }
    };

    // --- Render Logic ---
    return (
        <div className="card-container relative">
            {/* Header Section */}
            <div className="card-header flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-navy-700">Activity Impact</h3>
                    <p className="card-subtitle text-sm text-gray-500">
                        Measuring how activities affect your mood
                    </p>
                </div>

                {!isControlled && (
                    <div className="relative">
                        <HoverTooltip content="Select custom date range">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-[#3E9389] hover:bg-gray-100 transition-colors"
                            >
                                <MdOutlineCalendarToday className="h-5 w-5" />
                            </button>
                        </HoverTooltip>
                        {showDatePicker && (
                            <div className="absolute right-0 top-10 z-50 bg-white border rounded-lg shadow-xl p-4 min-w-[250px]">
                                <h4 className="text-sm font-semibold mb-3 text-gray-700">Select Date Range</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                        <input type="date" value={tempStart} onChange={(e) => setTempStart(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                        <input type="date" value={tempEnd} onChange={(e) => setTempEnd(e.target.value)} className="w-full border rounded p-1.5 text-sm" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setShowDatePicker(false)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button onClick={handleApplyDate} className="rounded-lg bg-[#3E9389] px-3 py-1 text-white hover:bg-[#88BFB9]">Apply</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="mb-3">
                <div className="color-key">
                    <div className="color-item">
                        <div className="color-dot" style={{ background: '#10b981' }}></div>
                        <div className="label">Improves Mood</div>
                    </div>
                    <div className="color-item">
                        <div className="color-dot" style={{ background: '#f59e0b' }}></div>
                        <div className="label">Zero Impact</div>
                    </div>
                    <div className="color-item">
                        <div className="color-dot" style={{ background: '#ef4444' }}></div>
                        <div className="label">Decreases Mood</div>
                    </div>
                </div>
            </div>


            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400">No data available for this period</div>
                </div>
            ) : !data || data.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">No data available for this period</p>
                </div>
            ) : (
                <>
                    {/* Key Insight Banner */}
                    {onInsightsChange && (() => {
                        const bestActivity = data.reduce((prev, current) => (prev.moodChange > current.moodChange) ? prev : current, data[0]);
                        if (bestActivity && bestActivity.moodChange > 0) {
                            return (
                                <div className="mb-4 w-full bg-blue-50/50 border border-blue-100/50 rounded-lg p-3 flex items-center gap-3">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                        💡
                                    </div>
                                    <div>
                                        <p className="text-sm text-navy-700">
                                            <span className="font-bold">{bestActivity.name}</span> has the highest positive impact <span className="font-bold text-green-600">(+{bestActivity.moodChange})</span> on your mood.
                                        </p>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* ApexChart Container */}
                    <div className="w-full h-64">
                        <BarChart
                            chartData={chartData}
                            chartOptions={chartOptions}
                        />
                    </div>

                    {/* Footer Insights / Summary */}
                    {onInsightsChange ? (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {data.slice(0, 5).map((activity, idx) => {
                                const activityColor = getActivityColor(activity.name);
                                const isPositive = activity.moodChange >= 0;
                                return (
                                    <div key={idx} className="flex items-center p-2 rounded bg-gray-50 border border-gray-100">
                                        <div className="flex-none w-2 h-2 rounded-full mr-2" style={{ backgroundColor: activityColor }}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs font-bold text-navy-700 truncate">{activity.name}</p>
                                                <span className={`text-xs font-bold ${isPositive ? "text-green-500" : "text-amber-500"}`}>
                                                    {isPositive ? "+" : ""}{activity.moodChange}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-4">
                            {/* Human-friendly expandable summary (only on report/dashboard main) */}
                            <SummaryBlock data={data} getActivityColor={getActivityColor} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MoodActivityCorrelation;