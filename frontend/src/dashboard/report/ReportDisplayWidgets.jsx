import React, { useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { AiOutlineLoading } from "react-icons/ai";
import Widget from "../../dashboard/widget/Widget";
import { useEmotions } from "../../hooks/useEmotions";
import HappyIcon from "../../icons/HappyIcon";
import SadIcon from "../../icons/SadIcon";
import AngryIcon from "../../icons/AngryIcon";
import FearIcon from "../../icons/FearIcon";

const emotionConfig = {
    Happy: {
        icon: <HappyIcon />,
        colors: ["#D97706", "#FEF3C7", "#FBBF24"]
    },
    Sad: {
        icon: <SadIcon />,
        colors: ["#059669", "#A7F3D0", "#34D399"]
    },
    Angry: {
        icon: <AngryIcon />,
        colors: ["#DB2777", "#FBCFE8", "#F472B6"]
    },
    Fear: {
        icon: <FearIcon />,
        colors: ["#1D4ED8", "#BAE6FD", "#60A5FA"]
    },
    Fear: {
        icon: <FearIcon />,
        colors: ["#1D4ED8", "#BAE6FD", "#60A5FA"]
    },
};

const ReportDisplayWidgets = ({ userId, startDate, endDate }) => {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');

    // Helper to ensure YYYY-MM-DD string format for the hook
    const formatDate = (date) => {
        if (!date) return "";
        if (typeof date === 'string') return date;
        // Adjust for local time to avoid off-by-one errors if using UTC methods directly on midnight local dates
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);

    const { emotions, loading } = useEmotions(
        token,
        userId,
        startStr,
        endStr
    );

    const ALL_EMOTIONS = ["Happy", "Sad", "Angry", "Fear"];

    // 1. Calculate the Grand Total of all emotions found in this period
    const totalCount = useMemo(() => {
        if (!emotions) return 0;
        return emotions.reduce((sum, e) => sum + Number(e.cnt), 0);
    }, [emotions]);

    if (loading) {
        return (
            <div className="dashboard-widget-wrapper">
                <div className="flex w-full items-center justify-center min-h-[100px]">
                    <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {ALL_EMOTIONS.map((label) => {
                // 2. Find data for this specific emotion
                const data = emotions?.find((e) => e.emotion_label === label);

                // 3. Get Count (Fallback to 0)
                const count = data ? Number(data.cnt) : 0;

                // 4. Calculate Percentage based on TOTAL COUNT
                const rawPercent = totalCount > 0 ? (count / totalCount) * 100 : 0;

                const config = emotionConfig[label] || {
                    icon: null,
                    colors: ["#A3AED0", "#E2E8F0", "#CBD5E0"]
                };

                return (
                    <Widget
                        key={label}
                        icon={config.icon}
                        title={t(`report.emotions.${label.toLowerCase()}`)}
                        subtitle={loading ? "..." : count.toString()}
                        percent={loading ? 0 : rawPercent}
                        gaugeColors={config.colors}
                    />
                );
            })}
        </div>
    );
};

export default ReportDisplayWidgets;