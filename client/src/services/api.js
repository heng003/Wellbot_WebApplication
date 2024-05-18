import axios from 'axios';

const API_URL = '/api';

export const getProperties = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`${API_URL}/properties`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  };