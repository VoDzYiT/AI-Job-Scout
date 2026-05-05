import api from './client';

export const authAPI = {
    register: (email, password, name) =>
        api.post('/auth/register', { email, password, full_name: name }),
    login: (email, password) =>
        api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
    updatePreferences: (rules) => api.put('/auth/preferences', { matching_rules: rules }),
};
