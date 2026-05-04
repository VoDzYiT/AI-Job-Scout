import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
    register: (email, password, fullName) =>
        api.post('/auth/register', {
            email,
            password,
            full_name: fullName
        }),
    getMe: () =>
        api.get('/auth/me'),
};

export default api;