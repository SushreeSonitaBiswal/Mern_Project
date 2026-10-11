import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careconnect_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('careconnect_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('careconnect_token', authData.token);
        localStorage.setItem('careconnect_user', JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      // Mock Fallback when backend is not actively running
      const MOCK_USERS = {
        'admin@careconnect.com': { role: 'ROLE_ADMIN', name: 'System Administrator', userId: 99, profileId: 1 },
        'raj.kumar@careconnect.com': { role: 'ROLE_DOCTOR', name: 'Dr. Raj Kumar', userId: 1, profileId: 1 },
        'rahul.sharma@careconnect.com': { role: 'ROLE_PATIENT', name: 'Rahul Sharma', userId: 10, profileId: 1 },
      };

      if (MOCK_USERS[email]) {
        const mockAuth = {
          token: 'mock-jwt-token-' + Date.now(),
          email,
          ...MOCK_USERS[email],
        };
        setToken(mockAuth.token);
        setUser(mockAuth);
        localStorage.setItem('careconnect_token', mockAuth.token);
        localStorage.setItem('careconnect_user', JSON.stringify(mockAuth));
        return mockAuth;
      }

      // Check registered patients in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('careconnect_registered_users') || '[]');
      const found = registeredUsers.find(u => u.email === email);
      if (found) {
        const mockAuth = {
          token: 'mock-jwt-token-' + Date.now(),
          email: found.email,
          name: found.name,
          role: 'ROLE_PATIENT',
          userId: Date.now(),
          profileId: Date.now(),
        };
        setToken(mockAuth.token);
        setUser(mockAuth);
        localStorage.setItem('careconnect_token', mockAuth.token);
        localStorage.setItem('careconnect_user', JSON.stringify(mockAuth));
        return mockAuth;
      }

      throw new Error(err?.message || 'Invalid email or password.');
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success && res.data) {
        const authData = res.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('careconnect_token', authData.token);
        localStorage.setItem('careconnect_user', JSON.stringify(authData));
        return authData;
      }
    } catch (err) {
      // Local fallback
      const registeredUsers = JSON.parse(localStorage.getItem('careconnect_registered_users') || '[]');
      registeredUsers.push(formData);
      localStorage.setItem('careconnect_registered_users', JSON.stringify(registeredUsers));

      const mockAuth = {
        token: 'mock-jwt-token-' + Date.now(),
        email: formData.email,
        name: formData.name,
        role: 'ROLE_PATIENT',
        userId: Date.now(),
        profileId: Date.now(),
      };
      setToken(mockAuth.token);
      setUser(mockAuth);
      localStorage.setItem('careconnect_token', mockAuth.token);
      localStorage.setItem('careconnect_user', JSON.stringify(mockAuth));
      return mockAuth;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('careconnect_token');
    localStorage.removeItem('careconnect_user');
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
