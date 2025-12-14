import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getIdFromToken } from '../utils/auth';

export const useEmotionalData = (startDate, endDate, bucketType = 'day', userIdOverride = null) => {
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const currentUserId = getIdFromToken();
            const targetUserId = userIdOverride || currentUserId;

            if (!startDate || !endDate) {
                setTrendData(null);
                return;
            }

            // FIX: Use local date formatting to avoid Timezone shifts (e.g., prev day)
            const formatDate = (date) => {
                if (!date) return "";
                // If it's already a string (YYYY-MM-DD), return it
                if (typeof date === 'string') return date;

                // Construct YYYY-MM-DD manually using local time
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const startStr = formatDate(startDate);
            const endStr = formatDate(endDate);

            const trendRes = await axios.get(
                `/api/emotion/getTrend/${targetUserId}?startDate=${startStr}&endDate=${endStr}&bucketType=${bucketType}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTrendData(trendRes.data || null);
        } catch (err) {
            console.error('Failed to fetch emotional data:', err);
            setError(err.message || 'Fetch error');
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, bucketType, userIdOverride]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { trendData, loading, error, refetch: fetchData };
};