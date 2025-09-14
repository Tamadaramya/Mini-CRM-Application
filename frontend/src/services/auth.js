import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user (client-side)
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  },

  // Set token in storage
  setToken(token) {
    localStorage.setItem('token', token);
  },

  // Remove token from storage
  removeToken() {
    localStorage.removeItem('token');
  }
};