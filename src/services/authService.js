import api from './api';

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  /**
   * Log in user
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Log out user
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Backend logout cleanup warning:', e);
    }
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Request password reset instructions
   */
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async ({ token, password }) => {
    return await api.post('/auth/reset-password', { token, password });
  },

  /**
   * Change current password
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    return await api.patch('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Test RBAC endpoint
   */
  testRoleAccess: async (type = 'agent') => {
    if (type === 'admin') {
      return await api.get('/auth/admin-only');
    }
    return await api.get('/auth/agent-agency-only');
  },
};
