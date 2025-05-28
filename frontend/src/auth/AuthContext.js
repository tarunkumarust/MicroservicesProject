
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const toast = useToast();
  const navigate = useNavigate();

  if (localStorage.getItem('user') === 'undefined') {
    localStorage.removeItem('user');
  }
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw && raw !== 'undefined' ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
 
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
    const res = await axios.post('http://localhost:3000/auth/login', { email, password });

    const data = res.data;

    const accessToken = res.data.access_token;

    localStorage.setItem('token', accessToken);
      if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    setToken(accessToken);
    setUser(data.user);
    toast({ title: 'Login successful', status: 'success' });
    navigate('/');
  } catch (err) {
    const message =
        err.response?.data?.message ||
        (err.response?.status === 401 ? 'Invalid credentials' : 'Login failed');
      toast({ title: 'Invalid credentials', status: 'error' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
