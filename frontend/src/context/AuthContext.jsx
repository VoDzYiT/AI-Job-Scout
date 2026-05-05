import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await authAPI.getMe();
            setUser(res.data);
        } catch {
            localStorage.removeItem('token');
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUser();
    }, []);

    const register = async (email, password, name) => {
        setError('');
        try {
            await authAPI.register(email, password, name);
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
            throw err;
        }
    };

    const login = async (email, password) => {
        setError('');
        try {
            const res = await authAPI.login(email, password);
            localStorage.setItem('token', res.data.access_token);
            await checkUser();
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};