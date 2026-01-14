import React, { useState, useMemo } from "react";
import DropdownIcon from "../icons/DropdownIcon";

// Expandable presentational summary component with color coding
const SummaryBlock = ({ data, getActivityColor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const summary = useMemo(() => {
        if (!data || data.length === 0) return null;

        const byAvg = [...data].sort((a, b) => b.avgMoodScore - a.avgMoodScore);
        const byChange = [...data].sort((a, b) => b.moodChange - a.moodChange);
        const byCount = [...data].sort((a, b) => b.activityCount - a.activityCount);

        const topLiked = byAvg[0]; // highest mood
        const topDuringNegative = byAvg[byAvg.length - 1]; // lowest mood
        const topImprover = byChange[0]; // highest mood change
        const topWorse = byChange[byChange.length - 1]; // lowest mood change
        const mostFrequent = byCount[0]; // most engaged activity

        const totalActivities = data.length;
        const totalEngagements = data.reduce((sum, d) => sum + (d.activityCount || 0), 0);
        const avgEngagementPerActivity = totalEngagements > 0 ? Math.round(totalEngagements / totalActivities) : 0;
        const avgMoodOverall = Math.round(data.reduce((sum, d) => sum + (d.avgMoodScore || 0), 0) / totalActivities);

        return {
            topLiked,
            topDuringNegative,
            topImprover,
            topWorse,
            mostFrequent,
            totalActivities,
            totalEngagements,
            avgEngagementPerActivity,
            avgMoodOverall
        };
    }, [data]);

    if (!summary) return null;

    return (
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 flex items-center justify-between hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                        💡
                    </div>
                    <p className="text-md font-bold text-gray-800">Quick Insights</p>
                </div>
                <span className={`text-gray-700 transform transition-transform duration-300 ease-in-out ${isExpanded ? '' : 'rotate-180'} scale-75`}>
                    <DropdownIcon />
                </span>
            </button>

            {isExpanded && (
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px] opacity-100 p-3" : "max-h-0 opacity-0"} border-t border-blue-200`}>
                    <div className="flex flex-col gap-3">
                        {/* Positive engagement */}
                        <div className="px-3 py-2 bg-white bg-opacity-60 rounded">
                            <p className="text-sm text-gray-800 font-semibold mb-1">When feel positive:</p>
                            <p className="text-sm text-gray-700">
                                Tend to engage with{' '}
                                <span
                                    className="font-bold px-2 py-1 rounded text-white text-xs inline-block"
                                    style={{ backgroundColor: getActivityColor(summary.topLiked.name) }}
                                >
                                    {summary.topLiked.name}
                                </span>
                            </p>
                        </div>

                        {/* Negative engagement */}
                        <div className="px-3 py-2 bg-white bg-opacity-60 rounded">
                            <p className="text-sm text-gray-800 font-semibold mb-1">When feel negative:</p>
                            {summary.topDuringNegative && summary.topDuringNegative.avgMoodScore < 50 ? (
                                <p className="text-sm text-gray-700">
                                    May turn to{' '}
                                    <span
                                        className="font-bold px-2 py-1 rounded text-white text-xs inline-block"
                                        style={{ backgroundColor: getActivityColor(summary.topDuringNegative.name) }}
                                    >
                                        {summary.topDuringNegative.name}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-700 italic">All activities have positive mood associations!</p>
                            )}
                        </div>

                        {/* Mood improvement */}
                        {summary.topImprover.moodChange > 0 && (
                            <div className="px-3 py-2 bg-white bg-opacity-60 rounded">
                                <p className="text-sm text-gray-800 font-semibold mb-1">Mood booster:</p>
                                <p className="text-sm text-gray-700">
                                    <span
                                        className="font-bold px-2 py-1 rounded text-white text-xs inline-block"
                                        style={{ backgroundColor: getActivityColor(summary.topImprover.name) }}
                                    >
                                        {summary.topImprover.name}
                                    </span>
                                    <span className="text-gray-700"> most increases mood (+{summary.topImprover.moodChange})</span>
                                </p>
                            </div>
                        )}

                        {/* Mood drainer */}
                        {summary.topWorse.moodChange < 0 && (
                            <div className="px-3 py-2 bg-white bg-opacity-60 rounded">
                                <p className="text-sm text-gray-800 font-semibold mb-1">Consider limiting:</p>
                                <p className="text-sm text-gray-700">
                                    <span
                                        className="font-bold px-2 py-1 rounded text-white text-xs inline-block"
                                        style={{ backgroundColor: getActivityColor(summary.topWorse.name) }}
                                    >
                                        {summary.topWorse.name}
                                    </span>
                                    <span className="text-gray-700"> may lower mood ({summary.topWorse.moodChange})</span>
                                </p>
                            </div>
                        )}

                        {/* Engagement stats */}
                        <div className="px-3 py-2 bg-white bg-opacity-60 rounded">
                            <p className="text-sm text-gray-800 font-semibold mb-1">Well-Bot Engagement:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-700">Total engagements</p>
                                    <p className="text-lg font-bold text-gray-800">{summary.totalEngagements}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700">Average Frequency per activity</p>
                                    <p className="text-lg font-bold text-gray-800">{summary.avgEngagementPerActivity}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700">Overall mood</p>
                                    <p className="text-lg font-bold text-gray-800">{summary.avgMoodOverall}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-700">Activities tracked</p>
                                    <p className="text-lg font-bold text-gray-800">{summary.totalActivities}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 text-md text-gray-500 mt-2 px-3 py-2 bg-white rounded border border-blue-100">
                            <p className="font-semibold text-gray-800">
                                💭 Tip:
                            </p>
                            <p>
                                Prioritize activities that boost mood and reduce those that lower it. These insights are based on the recent activity patterns and emotional logs.
                            </p>
                        </div>

                    </div>
                </div>
            )}
        </div >
    );
};

export default SummaryBlock;