import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Interface for user data (when using TypeScript)
 */
// interface User {
//   role: string;
//   [key: string]: any; // For additional user properties
// }

/**
 * Interface for authentication response (when using TypeScript)
 */
// interface AuthResponse {
//   message: string;
//   user?: User;
//   success?: boolean;
//   isAdmin?: boolean;
// }

/**
 * Service for handling authentication-related API calls
 */
export const authService = {
  /**
   * Login a user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise} - The API response
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`, 
        { username, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - The API response
   */
  register: async (username, email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`, 
        { username, email, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initiate password recovery process
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @returns {Promise} - The API response
   */
  forgotPassword: async (username, email) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { username, email },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token,password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        { token,password },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if the user is authenticated and get user data
   * @returns {Promise} - Authentication status and user data
   */
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`, { 
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      throw error;
    }
  },

  /**
   * Log out the current user
   * @returns {Promise} - The API response
   */
  logout: async () => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/logout`, 
        {}, 
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

export default authService;