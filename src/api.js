import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const storage = localStorage.getItem('auth-storage');
  
  if (storage) {
    try {
      const parsedStorage = JSON.parse(storage);
      const token = parsedStorage.state?.token;

      if (token) {
        config.headers.Authorization = token;
      }
    } catch (err) {
      console.error("Error parsing auth token", err);
    }
  }
  
  return config;
});

export default api;