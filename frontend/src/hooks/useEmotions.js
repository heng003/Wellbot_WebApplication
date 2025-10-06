import { useEffect, useState } from "react";
import axios from "axios";

export const useEmotions = (token, userId, startDate, endDate) => {
    const [data, setData] = useState({ emotions: [], timeSeries: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId && !token) return;

        const fetchData = async () => {
            try {
                const params = {};
                if (startDate) params.startDate = startDate;
                if (endDate) params.endDate = endDate;

                const res = await axios.get(`/api/emotion/getEmotionsByDate/${userId}`, {
                    params,
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch emotions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, userId, startDate, endDate]);

    return { ...data, loading };
};