import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get('http://localhost:5000/api/auth/me', config);
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            // Important: Update cart user ID if merging carts is needed, or just refresh
            localStorage.setItem('userId', res.data._id); // Sync cart with real user ID
            setUser(res.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response.data.message };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data._id);
            setUser(res.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response.data.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        // We might want to clear userId or reset to a guest ID
        const guestId = `user_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', guestId);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
