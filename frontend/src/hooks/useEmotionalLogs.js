import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useEmotionalLogs = (userId, startDate, endDate) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!userId || !startDate || !endDate) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Format YYYY-MM-DD
            const startStr = new Date(startDate).toISOString().split('T')[0];
            const endStr = new Date(endDate).toISOString().split('T')[0];
            
            const res = await axios.get(
                `/api/emotion/getLogs/${userId}?startDate=${startStr}&endDate=${endStr}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch emotional logs", err);
        } finally {
            setLoading(false);
        }
    }, [userId, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading };
};