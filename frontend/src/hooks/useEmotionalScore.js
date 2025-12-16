import { useState, useCallback } from 'react';
import axios from 'axios';

export const useEmotionalScore = (targetUserId, startDate, endDate, bucketType = 'day') => {
	const [trendData, setTrendData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = localStorage.getItem('token');
			const userId = targetUserId;

			if (!startDate || !endDate) {
				setTrendData(null);
				return;
			}

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
				`/api/emotion/getTrend/${userId}?startDate=${startStr}&endDate=${endStr}&bucketType=${bucketType}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const data = trendRes.data || {};

			// --- SAFETY FIX: Handle "NaN" string from backend ---
			if (data.trendPercentage === "NaN" || Number.isNaN(Number(data.trendPercentage))) {
				data.trendPercentage = 0;
			}

			setTrendData(data);
		} catch (err) {
			console.error('Failed to fetch emotional data:', err);
			setError(err.message || 'Fetch error');
			setTrendData(null);
		} finally {
			setLoading(false);
		}
	}, [targetUserId, startDate, endDate, bucketType]);

	return { trendData, loading, error, refetch: fetchData };
};