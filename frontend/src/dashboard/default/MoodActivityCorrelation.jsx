import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Label,
} from "recharts";
import axios from "axios";
import { getIdFromToken } from "../../utils/auth";
import { computeMoodActivityInsights } from "../../utils/reportUtils";
import { MdOutlineCalendarToday } from "react-icons/md"; // Using standard icon
import "../../styles/moodActivityChart.css";
import SummaryBlock from "../../components/SummaryBlock";
import HoverTooltip from "../../components/HoverTooltip";

const MoodActivityCorrelation = ({ startDate: propStartDate, endDate: propEndDate, userId: propUserId, onInsightsChange }) => {
    const userId = propUserId || getIdFromToken();

    // Check if the component is being controlled by a parent dashboard
    const isControlled = propStartDate !== undefined && propEndDate !== undefined;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for internal date picker visibility
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Helper to get default range (current month)
    const getDefaultRange = () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start, end: today };
    };

    const [dateRange, setDateRange] = useState(() => {
        if (isControlled) {
            return { start: propStartDate, end: propEndDate };
        }
        return getDefaultRange();
    });

    // Temp state for date inputs before applying
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    const formatLocalDate = (d) => {
        if (!d || !(d instanceof Date)) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    // Sync with props if controlled
    useEffect(() => {
        if (isControlled) {
            setDateRange({ start: propStartDate, end: propEndDate });
        }
    }, [propStartDate, propEndDate, isControlled]);

    // Initialize temp inputs when dateRange changes (for the picker)
    useEffect(() => {
        setTempStart(formatLocalDate(dateRange.start));
        setTempEnd(formatLocalDate(dateRange.end));
    }, [dateRange]);

    useEffect(() => {
        const fetchData = async () => {
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

                // Transform data for the chart
                const transformedData = (response.data.correlation || []).map((item) => ({
                    name: item.activity_type || "Unknown",
                    avgMoodScore: Math.round(item.avg_mood_score || 0),
                    moodChange: Math.round(item.mood_change || 0),
                    activityCount: item.activity_count || 0,
                    avgConfidence: (item.avg_confidence || 0).toFixed(2),
                }));

                setData(transformedData);
                setError(null);

                // Compute and pass insights to parent if callback provided
                if (onInsightsChange) {
                    const insights = computeMoodActivityInsights(transformedData);
                    onInsightsChange(insights);
                }
            } catch (err) {
                console.error("Error fetching mood-activity correlation:", err);
                if (err.response && err.response.status !== 404) {
                    setError(err.response?.data?.error || "Failed to fetch data");
                } else {
                    setData([]); // Treat 404 as empty data
                }
                // Clear insights on error
                if (onInsightsChange) {
                    onInsightsChange(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, dateRange.start, dateRange.end, onInsightsChange]);

    const handleApplyDate = () => {
        if (!tempStart || !tempEnd) return;
        setDateRange({
            start: new Date(tempStart),
            end: new Date(tempEnd)
        });
        setShowDatePicker(false);
    };

    // Activity-type based colors (for insight accents)
    const activityColors = {
        'Support Chat': '#519AF6',
        'Journaling': '#69D5C5',
        'Gratitude': '#EA5E8F',
        'Meditation with Music': '#FF9F68',
        'Daily Quote': '#FFD56B'
    };

    const getActivityColor = (activityName) => {
        return activityColors[activityName] || '#3b82f6';
    };

    const getMoodChangeColor = (value) => {
        if (value > 0) return "#10b981"; // Green - Improves mood
        if (value === 0) return "#fbbf24"; // Yellow - No change
        return "#ef4444"; // Light red - Decreases mood
    };

    // --- Render Logic ---
    return (
        <div className="card-container relative">
            {/* Header Section with Title and Conditional Date Picker */}
            <div className="card-header flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold">Activity Impact on Mood</h3>
                    <p className="card-subtitle text-sm">
                        How different activities correlate with your mood changes
                    </p>
                </div>

                {/* Only show Date Picker Trigger if NOT controlled */}
                {!isControlled && (
                    <div className="relative">
                        <HoverTooltip content="Select custom date range">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 transition-colors"
                            >
                                <MdOutlineCalendarToday className="h-5 w-5" />
                            </button>
                        </HoverTooltip>

                        {/* Date Picker Dropdown */}
                        {showDatePicker && (
                            <div className="absolute right-0 top-10 z-50 bg-white border rounded-lg shadow-xl p-4 min-w-[250px]">
                                <h4 className="text-sm font-semibold mb-3 text-gray-700">Select Date Range</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={tempStart}
                                            onChange={(e) => setTempStart(e.target.value)}
                                            className="w-full border rounded p-1.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={tempEnd}
                                            onChange={(e) => setTempEnd(e.target.value)}
                                            className="w-full border rounded p-1.5 text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setShowDatePicker(false)}
                                            className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApplyDate}
                                            className="px-3 py-1 text-xs bg-brand-500 text-white rounded hover:bg-brand-600"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <div className="text-gray-500">Loading data...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-80">
                    <div className="text-red-500 text-sm">Error: {error}</div>
                </div>
            ) : !data || data.length === 0 ? (
                // SPECIFIC NO DATA UI
                <div className="flex h-80 items-center justify-center rounded-lg bg-gray-50">
                    <p className="text-gray-400">No data available for this period</p>
                </div>
            ) : (
                <>
                    {/* Color key explanation (styled) */}
                    <div className="mb-3">
                        <div className="color-key">
                            <div className="color-item">
                                <div className="color-dot" style={{ background: '#10b981' }}></div>
                                <div className="label">Improves Mood (Positive Mood Change)</div>
                            </div>
                            {/* <div className="color-item">
                                <div className="color-dot" style={{ background: '#f59e0b' }}></div>
                                <div className="label">Neutral (No Mood Change)</div>
                            </div> */}
                            <div className="color-item">
                                <div className="color-dot" style={{ background: '#ef4444' }}></div>
                                <div className="label">Decreases Mood (Negative Mood Change)</div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-wrapper h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#A3AED0", fontSize: "12px" }}
                                    dy={10}
                                >
                                    <Label value="Activity" position="bottom" offset={5} style={{ fontWeight: 400, fill: "#334155" }} />
                                </XAxis>
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#A3AED0", fontSize: "12px" }}
                                    domain={[0, 100]}
                                    label={{ value: 'Average Mood (%)', angle: -90, position: 'insideLeft', offset: 10, style: { fontWeight: 400, fill: "#334155", textAnchor: 'middle' } }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    hide={true}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        color: '#fff',
                                        border: "none",
                                        borderRadius: "8px",
                                        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#fff', fontWeight: 600 }}
                                    formatter={(value, name) => {
                                        if (name === 'avgMoodScore') return [`${value}%`, 'Average Mood'];
                                        if (name === 'moodChange') return [value, 'Mood Change'];
                                        if (name === 'activityCount') return [value, 'Activity Count'];
                                        return [value, name];
                                    }}
                                />
                                <Bar
                                    yAxisId="left"
                                    dataKey="avgMoodScore"
                                    name="Average Mood Score"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={"#3b82f6"} />
                                    ))}
                                </Bar>
                                <Bar
                                    yAxisId="right"
                                    dataKey="moodChange"
                                    name="Mood Change"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                    fill="#8b5cf6"
                                    opacity={0.6}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getMoodChangeColor(entry.moodChange)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Footer Insights */}
                    {onInsightsChange ? (
                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {data.slice(0, 5).map((activity, idx) => {
                                const activityColor = getActivityColor(activity.name);
                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col p-3 rounded-lg bg-gray-50 border border-gray-100 min-h-[90px] h-full"
                                    >
                                        {/* Row 1: Icon + Title */}
                                        {/* Added items-start and mt-0.5 to align dot with top of text if it wraps */}
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className="flex-none w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: activityColor }}></div>
                                            <div className="min-w-0 flex-1">
                                                {/* Updated classes for better wrapping and spacing */}
                                                <p className="text-sm font-semibold text-gray-800 break-words leading-tight line-clamp-2" title={activity.name}>
                                                    {activity.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 mt-auto w-full">
                                            <div className="flex justify-between items-baseline w-full">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">Mood</span>
                                                <span className="text-sm font-bold text-navy-700 ml-1">{activity.avgMoodScore}%</span>
                                            </div>
                                            <div className="flex justify-between items-baseline w-full">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">Change</span>
                                                <span className={`text-xs font-bold ml-1 ${activity.moodChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {activity.moodChange > 0 ? "+" : ""}{activity.moodChange}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-baseline w-full border-t border-gray-200 pt-1 mt-1">
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">Freq</span>
                                                <span className="text-xs text-gray-600 ml-1">{activity.activityCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="chart-insights mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {data.slice(0, 5).map((activity, idx) => {
                                const activityColor = getActivityColor(activity.name);
                                return (
                                    <div
                                        key={idx}
                                        className="insight-card p-3 bg-gray-50 rounded-lg border border-gray-100"
                                        style={{ ['--activity-color']: activityColor }}
                                    >
                                        <p className="text-xs font-semibold text-gray-800 truncate" title={activity.name}>
                                            {activity.name}
                                        </p>
                                        <div className="mt-2">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-sm font-bold text-navy-700">
                                                    {activity.avgMoodScore}% <span className="text-xs font-normal text-gray-500">(average mood)</span>
                                                </span>
                                                <span className={`text-xs font-medium ${activity.moodChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {activity.moodChange > 0 ? "+" : ""}{activity.moodChange}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Frequency: {activity.activityCount}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Human-friendly expandable summary */}
                    {data && data.length > 0 && !onInsightsChange && (
                        <SummaryBlock data={data} getActivityColor={getActivityColor} />
                    )}
                </>
            )}
        </div>
    );
};

export default MoodActivityCorrelation;