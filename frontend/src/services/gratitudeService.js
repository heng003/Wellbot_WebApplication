import axios from 'axios';

const API_URL = '/api/gratitude';

const tokenHeader = () => {
	const token = localStorage.getItem('token');
	return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchGratitudes = async (userId) => {
	const response = await axios.get(`${API_URL}/${userId}`, tokenHeader());
	return response.data;
};

export const toggleFav = async (gratitudeId, fav) => {
	const response = await axios.patch(`${API_URL}/${gratitudeId}/fav`,
		{ fav },
		tokenHeader()
	);
	return response.data;
};

export const createGratitude = async (userId, text, fav) => {
	const response = await axios.post(
		`${API_URL}/create`,
		{ user_id: userId, text, fav },
		tokenHeader()
	);
	return response.data;
};

export const updateGratitude = async (gratitudeId, payload) => {
	const response = await axios.patch(`${API_URL}/update/${gratitudeId}`,
		payload,
		tokenHeader()
	);
	return response.data;
};

export const deleteGratitude = async (gratitudeId) => {
	const response = await axios.delete(`${API_URL}/delete/${gratitudeId}`,
		tokenHeader()
	);
	return response.data;
};