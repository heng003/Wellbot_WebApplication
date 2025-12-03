import axios from 'axios';

const tokenHeader = () => {
	const token = localStorage.getItem('token');
	return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchJournals = async (userId) => {
	const res = await axios.get(`/api/journal/${userId}`, tokenHeader());
	return res.data;
};

export const toggleFav = async (journalId, fav) => {
	const res = await axios.patch(`/api/journal/${journalId}/fav`, { fav }, tokenHeader());
	return res.data;
};

export const updateJournal = async (journalId, payload) => {
	const res = await axios.patch(`/api/journal/${journalId}`, payload, tokenHeader());
	return res.data;
};
