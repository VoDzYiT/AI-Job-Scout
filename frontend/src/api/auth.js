import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (email, password, name) =>
        api.post('/auth/register', { email, password, full_name: name }),
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
};