import axios from 'axios';

const API_URL = '/api/permission/guardian'; 

export const fetchActiveWards = async (guardianId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/getActiveWards/${guardianId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data; 
};