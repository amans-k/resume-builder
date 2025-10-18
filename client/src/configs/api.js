import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
}); // ✅ Remove extra closing brace

export default api;