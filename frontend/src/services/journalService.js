import axios from 'axios';

const tokenHeader = () => {
	const token = localStorage.getItem('token');
	return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchJournals = async (userId) => {
	const response = await axios.get(`/api/journal/${userId}`, tokenHeader());
	return response.data;
};

export const toggleFav = async (journalId, fav) => {
	const response = await axios.patch(`/api/journal/${journalId}/fav`, { fav }, tokenHeader());
	return response.data;
};

export const updateJournal = async (journalId, payload) => {
	const response = await axios.patch(
		`/api/journal/${journalId}`,
		payload,
		tokenHeader()
	);
	return response.data;
};

export const createJournal = async ({ user_id, title, body, fav }) => {
	const response = await axios.post(
		`/api/journal/create`,
		{ user_id, title, body, fav },
		tokenHeader()
	);
	return response.data;
};

export const deleteJournal = async (journalId) => {
	const response = await axios.delete(`/api/journal/delete/${journalId}`,
		tokenHeader()
	);
	return response.data;
};
