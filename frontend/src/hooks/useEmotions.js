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

                // Format dates as YYYY-MM-DD (expected by backend)
                // If startDate/endDate are already YYYY-MM-DD strings, use as-is
                // If they are DD-MM-YYYY, convert to YYYY-MM-DD
                const formatDate = (d) => {
                    if (!d) return "";
                    // Check if already YYYY-MM-DD format
                    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
                        return d;
                    }
                    // Check if DD-MM-YYYY format
                    if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
                        const [day, month, year] = d.split("-");
                        return `${year}-${month}-${day}`;
                    }
                    // Otherwise treat as Date object
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
        };

        fetchData();
    }, [token, userId, startDate, endDate]);

    return { ...data, loading };
};