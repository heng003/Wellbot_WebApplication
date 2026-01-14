import React, { useMemo } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useTranslation } from 'react-i18next';
import { getIdFromToken } from '../utils/auth';
import { useEmotions } from "../hooks/useEmotions";
import Widget from "../dashboard/widget/Widget";
import HappyIcon from "../icons/HappyIcon";
import SadIcon from "../icons/SadIcon";
import AngryIcon from "../icons/AngryIcon";
import FearIcon from "../icons/FearIcon";

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
};

const DisplayWidgets = ({ userId: propUserId }) => {
    const { t } = useTranslation();
    const token = localStorage.getItem('token');
    const userId = propUserId || getIdFromToken();
    const today = new Date().toISOString().slice(0, 10);

    const { emotions, loading } = useEmotions(
        token,
        userId,
        today,
        today,
    );

    const ALL_EMOTIONS = ["Happy", "Sad", "Angry", "Fear"];

    // 1. Calculate the Grand Total of all emotions found
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
        <div className="dashboard-widget-wrapper">
            <div className="dashboard-widget-grid">
                {ALL_EMOTIONS.map((label) => {
                    // 2. Find data for this specific emotion
                    const data = emotions?.find((e) => e.emotion_label === label);

                    // 3. Get Count (Fallback to 0)
                    const count = data ? Number(data.cnt) : 0;

                    // 4. Calculate Percentage based on TOTAL COUNT
                    // Formula: (This Emotion Count / Total Emotions) * 100
                    const rawPercent = totalCount > 0 ? (count / totalCount) * 100 : 0;

                    const config = emotionConfig[label] || {
                        icon: null,
                        colors: ["#1D4ED8", "#BAE6FD", "#60A5FA"]
                    };

                    return (
                        <Widget
                            key={label}
                            icon={config.icon}
                            title={t(`report.emotions.${label.toLowerCase()}`)}
                            subtitle={count}
                            percent={rawPercent} // sends percentage share of today's emotions (e.g., 25.5)
                            gaugeColors={config.colors}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DisplayWidgets;