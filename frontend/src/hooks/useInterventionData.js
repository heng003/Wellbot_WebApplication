import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Helper: Format date as YYYY-MM-DD (Local Time)
export const formatLocalDate = (d) => {
    if (!d || !(d instanceof Date)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

// Helper: Calculate Start and End dates based on referenceDate and timeRange
// Exported so components can use it for labels (e.g., displaying "Dec 1 - Dec 7")
export const getStartEndDate = (refDate, range) => {
    const start = new Date(refDate);
    const end = new Date(refDate);

    // Reset time components
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (range === "weekly") {
        // Calculate week range (Monday to Sunday)
        const day = start.getDay() || 7; // Convert Sunday (0) to 7, so Mon=1..Sun=7
        const diff = start.getDate() - day + 1; // Subtract to get Monday
        start.setDate(diff);
        // End date is 6 days after Monday (Sunday)
        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    } else if (range === "monthly") {
        // First to Last day of the month
        start.setDate(1);
        end.setMonth(start.getMonth() + 1, 0);
    } else if (range === "yearly") {
        // Jan 1st to Dec 31st
        start.setMonth(0, 1);
        end.setMonth(11, 31);
    }
    // "all" or invalid ranges return the initial refDate or handle loosely
    return { start, end };
};

/**
 * Custom Hook to fetch intervention logs
 * @param {string} userId - The user's ID
 * @param {string} timeRange - "weekly", "monthly", "yearly", or "all"
 * @param {Date} referenceDate - The anchor date (default: today)
 */
export const useInterventionData = (userId, timeRange = "all", referenceDate) => {
    // Default referenceDate to today if not provided, memoized to prevent loops if passed inline
    const validRefDate = referenceDate instanceof Date ? referenceDate : new Date();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            let url = `/api/intervention/${userId}`;

            // Only append query params if not fetching "all" history
            if (timeRange !== "all") {
                const { start, end } = getStartEndDate(validRefDate, timeRange);
                const startStr = formatLocalDate(start);
                const endStr = formatLocalDate(end);
                url += `?startDate=${startStr}&endDate=${endStr}`;
            }

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Handle different API response structures ({ data: [...] } or [...])
            const rawData = res.data?.data || res.data || [];
            setData(rawData);
        } catch (err) {
            console.error("Failed to fetch intervention logs", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId, timeRange, validRefDate]); // Dependencies ensure refetch on change

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};