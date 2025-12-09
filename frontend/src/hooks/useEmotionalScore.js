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

			// Helper to format date objects to YYYY-MM-DD for API URL
			const formatDate = (date) => {
				if (!date) return '';
				// If it's already a string, assume it's correct
				if (typeof date === 'string') return date.split('T')[0];
				// If it's a Date object
				return date.toISOString().split('T')[0];
			};

			const sDate = formatDate(startDate);
			const eDate = formatDate(endDate);

			const trendRes = await axios.get(
				`/api/emotion/getTrend/${userId}?startDate=${sDate}&endDate=${eDate}&bucketType=${bucketType}`,
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