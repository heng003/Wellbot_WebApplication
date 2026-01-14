import React, { useEffect, useMemo } from "react";
import Card from "../dashboard/card";
import { AiOutlineLoading } from "react-icons/ai";
import { getEmotionLabel } from "../utils/emotionClassifier";

import { useTranslation } from "react-i18next";

const MessagePatternInsights = ({ rawEmbeddings, onInsightsCalculated, loading = false }) => {
    const { t } = useTranslation();
    const insights = useMemo(() => {
        if (!rawEmbeddings || rawEmbeddings.length === 0) return null;

        // Helper to classify emotion from text
        // Helper to classify emotion from text
        // Used from shared utility

        // Count message frequencies
        const messageCounts = {};
        const messagesByEmotion = {};

        rawEmbeddings.forEach((embedding) => {
            const text = embedding.text_content || "";
            const emotion = getEmotionLabel(text);

            // Normalize message (lowercase, trim)
            const normalized = text.toLowerCase().trim();

            // Track overall frequency
            messageCounts[normalized] = (messageCounts[normalized] || 0) + 1;

            // Track by emotion
            if (!messagesByEmotion[emotion]) {
                messagesByEmotion[emotion] = {};
            }
            messagesByEmotion[emotion][normalized] = (messagesByEmotion[emotion][normalized] || 0) + 1;
        });

        // Get top 3 overall recurring messages
        const topRecurring = Object.entries(messageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([text, count]) => ({
                text,
                count,
                emotion: getEmotionLabel(text),
                percentage: Math.round((count / rawEmbeddings.length) * 100)
            }));

        // Get top message per emotion
        const topPerEmotion = Object.entries(messagesByEmotion).reduce((acc, [emotion, msgs]) => {
            const top = Object.entries(msgs)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(([text, count]) => ({
                    text,
                    count,
                    percentage: Math.round((count / (rawEmbeddings.filter(e => getEmotionLabel(e.text_content) === emotion).length || 1)) * 100)
                }));
            acc[emotion] = top;
            return acc;
        }, {});

        // Emotional pattern - which emotions appear most
        const emotionFreq = Object.entries(messagesByEmotion).reduce((acc, [emotion, msgs]) => {
            acc[emotion] = Object.values(msgs).reduce((sum, count) => sum + count, 0);
            return acc;
        }, {});

        // Message uniqueness
        const uniqueMessages = Object.keys(messageCounts).length;
        const uniquePercentage = Math.round((uniqueMessages / rawEmbeddings.length) * 100);

        return {
            topRecurring,
            topPerEmotion,
            emotionFreq,
            uniqueMessages,
            uniquePercentage,
            totalMessages: rawEmbeddings.length
        };
    }, [rawEmbeddings]);

    useEffect(() => {
        if (onInsightsCalculated && insights) {
            onInsightsCalculated(insights);
        }
    }, [insights, onInsightsCalculated]);

    if (loading) return (
        <div className="flex w-full items-center justify-center mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-[300px]">
            <div className="flex flex-col items-center gap-3">
                <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                <p className="text-sm font-medium text-gray-500">Analyzing patterns...</p>
            </div>
        </div>
    );

    if (!insights) return null;

    const emotionColors = {
        'Happy': '#FFD56B',
        'Angry': '#EA5E8F',
        'Sad': '#69D5C5',
        'Fear': '#519AF6',
        'Neutral': '#A3AED0'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {/* Top 3 Recurring Messages */}
            <Card extra="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{t('dashboard.message_insights.top_recurring')}</h3>
                    <p className="text-xs text-gray-500">{t('dashboard.message_insights.top_recurring_desc')}</p>
                </div>
                <div className="flex flex-col gap-3">
                    {insights.topRecurring.map((msg, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span
                                    className="text-xs font-bold px-2 py-1 rounded text-white"
                                    style={{ backgroundColor: emotionColors[msg.emotion] || '#A3AED0' }}
                                >
                                    {msg.emotion}
                                </span>
                                <span className="text-sm font-bold text-gray-800">{msg.count} times ({msg.percentage}%)</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">"{msg.text}"</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Emotional Pattern Breakdown */}
            <Card extra="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{t('dashboard.message_insights.emotion_freq')}</h3>
                    <p className="text-xs text-gray-500">{t('dashboard.message_insights.emotion_freq_desc')}</p>
                </div>
                <div className="flex flex-col gap-3">
                    {Object.entries(insights.emotionFreq)
                        .sort((a, b) => b[1] - a[1])
                        .map(([emotion, count]) => {
                            const percentage = Math.round((count / insights.totalMessages) * 100);
                            return (
                                <div key={emotion} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-semibold text-gray-800">{emotion}</span>
                                            <span className="text-xs font-bold text-gray-700">{percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: emotionColors[emotion]
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </Card>

            {/* Top Messages by Emotion */}
            {Object.keys(insights.topPerEmotion).map((emotion) => (
                <Card key={emotion} extra="p-4">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: emotionColors[emotion] }}
                            />
                            <p className="text-lg font-bold text-gray-800">{t('dashboard.message_insights.top_emotion_msgs', { emotion })}</p>
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.message_insights.top_emotion_desc', { emotion: emotion.toLowerCase() })}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {insights.topPerEmotion[emotion].map((msg, idx) => (
                            <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-700">#{idx + 1}</span>
                                    <span className="text-xs font-bold text-gray-700">{msg.count} times</span>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">"{msg.text}"</p>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

            {/* Message Uniqueness & Stats */}
            <Card extra={`p-4 ${(Object.keys(insights.topPerEmotion).length + 3) % 2 !== 0 ? 'lg:col-span-2' : ''}`}>
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{t('dashboard.message_insights.stats_title')}</h3>
                    <p className="text-xs text-gray-500">{t('dashboard.message_insights.stats_desc')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-700 mb-1">{t('dashboard.message_insights.total_msgs')}</p>
                        <p className="text-2xl font-bold text-blue-600">{insights.totalMessages}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-700 mb-1">{t('dashboard.message_insights.unique_msgs')}</p>
                        <p className="text-2xl font-bold text-purple-600">{insights.uniqueMessages}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 col-span-2">
                        <p className="text-xs text-gray-700 mb-1">{t('dashboard.message_insights.diversity')}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-indigo-600">{insights.uniquePercentage}%</p>
                            <p className="text-xs text-gray-700">{t('dashboard.message_insights.diversity_suffix')}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MessagePatternInsights;
