import axios from 'axios';

export const fetchActiveWards = async (guardianId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/permission/guardian/getActiveWards/${guardianId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};

export const fetchUserEmbeddings = async (userId, startDate, endDate) => {
    const token = localStorage.getItem('token');
    let url = `/api/embedding/${userId}`;
    if (startDate && endDate) {
        const s = new Date(startDate).toISOString();
        const e = new Date(endDate).toISOString();
        url += `?startDate=${s}&endDate=${e}`;
    } else if (startDate) {
        const s = new Date(startDate).toISOString();
        url += `?startDate=${s}`;
    } else if (endDate) {
        const e = new Date(endDate).toISOString();
        url += `?endDate=${e}`;
    }

    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
};