import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Verification API methods
export const adminAPI = {
  // Get all users for verification
  getVerificationUsers: () => api.get('/admin/users/verification'),
  
  // Approve a user
  approveUser: (userId) => api.post(`/admin/users/${userId}/approve`),
  
  // Reject a user
  rejectUser: (userId) => api.post(`/admin/users/${userId}/reject`),
  
  // Get user details
  getUserDetails: (userId) => api.get(`/admin/users/${userId}/details`),
  
  // Create admin user (for testing)
  createAdminUser: (email, password) => 
    api.post('/admin/create-admin', null, {
      params: { email, password }
    })
};

// Auth API methods
export const authAPI = {
  // Login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Register
  register: (userData) => api.post('/auth/register', userData),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    // Additional logout logic if needed
  }
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  // Get current user token
  getToken: () => localStorage.getItem('token'),
  
  // Set authentication token
  setToken: (token) => localStorage.setItem('token', token),
  
  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem('token');
  },
  
  // Transform image URLs for proper display
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
  }
};

export default api;