import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import { useSocketSubscription } from "./useSocket";

export const useEmotions = (token, userId, startDate, endDate) => {
    const [data, setData] = useState({ emotions: [], timeSeries: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = React.useCallback(async () => {
        if (!userId && !token) return;

        try {
            setLoading(true);
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            // Format dates as YYYY-MM-DD (expected by backend)
            const formatDate = (d) => {
                if (!d) return "";
                if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
                if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
                    const [day, month, year] = d.split("-");
                    return `${year}-${month}-${day}`;
                }
                if (d instanceof Date) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const dd = String(d.getDate()).padStart(2, "0");
                    return `${yyyy}-${mm}-${dd}`;
                }
                return "";
            };

            const formattedStart = formatDate(startDate);
            const formattedEnd = formatDate(endDate);

            const res = await axios.get(
                `/api/emotion/getEmotionsByDate/${userId}`,
                {
                    params: {
                        startDate: formattedStart,
                        endDate: formattedEnd,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch emotions", err);
        } finally {
            setLoading(false);
        }
    }, [token, userId, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useSocketSubscription(['emotional_log'], fetchData);

    return { ...data, loading, refetch: fetchData };
};