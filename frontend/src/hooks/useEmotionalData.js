import { useState, useCallback } from 'react';
import axios from 'axios';
import { getIdFromToken } from '../utils/auth';

export const useEmotionalData = (startDate, endDate, bucketType = 'day') => {
	const [trendData, setTrendData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const token = localStorage.getItem('token');
			const userId = getIdFromToken();

			if (!startDate || !endDate) {
				setTrendData(null);
				return;
			}

			const formatDate = (date) => {
				return typeof date === 'string'
					? date
					: new Date(date).toISOString().split('T')[0];
			};

			// ONLY fetch trend data
			const trendRes = await axios.get(
				`/api/emotion/getTrend/${userId}?startDate=${formatDate(
					startDate
				)}&endDate=${formatDate(endDate)}&bucketType=${bucketType}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setTrendData(trendRes.data || null);
		} catch (err) {
			console.error('Failed to fetch emotional data:', err);
			setError(err.message || 'Fetch error');
		} finally {
			setLoading(false);
		}
	}, [startDate, endDate, bucketType]);

	return { trendData, loading, error, refetch: fetchData };
};