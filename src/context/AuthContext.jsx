import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { API_ENDPOINTS } from '../services/apiConfig';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token) {
      // Try to get user info from token or make a request to verify
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Check if token is expired
      checkTokenExpiration();
    }
    setLoading(false);
    
    // Listen for token expiration events from API calls
    const handleTokenExpired = () => {
      logout();
      alert('Your session has expired. Please log in again.');
    };
    
    window.addEventListener('authTokenExpired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('authTokenExpired', handleTokenExpired);
    };
  }, [token]);

  const checkTokenExpiration = () => {
    if (!token) return;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        // Token is expired, logout user
        console.log('Token expired, logging out user');
        logout();
        alert('Your session has expired. Please log in again.');
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      const { token: authToken, roles, nicNumber, userId } = response;
      
      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify({
        email,
        roles,
        nicNumber,
        userId
      }));

      setToken(authToken);
      setUser({
        email,
        roles,
        nicNumber,
        userId
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear shopping/ordering related data
    localStorage.removeItem('aqualink_order_data');
    localStorage.removeItem('aqualink_received_quotes');
    localStorage.removeItem('customerOrders');
    
    // Clear seller-specific quote requests
    // Find and remove all aqualink_quote_request_* keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('aqualink_quote_request_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setToken(null);
    setUser(null);
    
    // Dispatch a custom event to trigger navigation to home page and cart clearing
    window.dispatchEvent(new CustomEvent('user-logout'));
  };

  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const refreshUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    hasRole,
    isAuthenticated,
    refreshUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};