import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: BASE_URL
});

// Automatically add the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;