import axios from 'axios';

const API_URL = "https://resume-builder-3-xfol.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // ✅ Add timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ ADD RESPONSE INTERCEPTOR FOR JSON ERRORS
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // ✅ Check if response is HTML instead of JSON
    if (error.response && 
        error.response.headers['content-type']?.includes('text/html') &&
        error.config.url !== '/health') {
      console.error('Backend returned HTML instead of JSON for:', error.config.url);
      return Promise.reject(new Error('Backend server error - please try again later'));
    }
    return Promise.reject(error);
  }
);

export default api;