import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('trusty_auth_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('trusty_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  // Save session state to localStorage
  const setSession = (tokenVal, userVal) => {
    if (tokenVal) {
      localStorage.setItem('trusty_auth_token', tokenVal);
      setToken(tokenVal);
    } else {
      localStorage.removeItem('trusty_auth_token');
      setToken(null);
    }

    if (userVal) {
      localStorage.setItem('trusty_auth_user', JSON.stringify(userVal));
      setUser(userVal);
    } else {
      localStorage.removeItem('trusty_auth_user');
      setUser(null);
    }
  };

  // Verify and hydrate current user on initial app launch
  const refreshUser = useCallback(async () => {
    const existingToken = localStorage.getItem('trusty_auth_token');
    if (!existingToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.getMe();
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('trusty_auth_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Session hydration failed:', err.message);
      setSession(null, null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen for custom expired events from axios interceptor
    const handleExpired = () => {
      setSession(null, null);
      toast.warning('Your session has expired. Please log in again.');
    };

    window.addEventListener('trusty:auth:expired', handleExpired);
    return () => window.removeEventListener('trusty:auth:expired', handleExpired);
  }, [refreshUser]);

  // Login handler
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      const { user: userData, token: tokenData } = response.data;

      setSession(tokenData, userData);
      toast.success(`Welcome back, ${userData.firstName}!`, 'Login Successful');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg, 'Authentication Failed');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(userData);
      const { user: newUser, token: newToken } = response.data;

      setSession(newToken, newUser);
      toast.success(`Account registered as ${newUser.role.toUpperCase()}!`, 'Welcome to TRUSTY');
      return { success: true, user: newUser };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setError(msg);
      toast.error(msg, 'Registration Error');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignored for graceful cleanup
    } finally {
      setSession(null, null);
      toast.info('You have been securely signed out.', 'Signed Out');
    }
  };

  // Change password
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      setIsLoading(true);
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.data?.token) {
        setSession(res.data.token, res.data.user);
      }
      toast.success('Your password has been successfully updated.', 'Password Changed');
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Could not change password.';
      toast.error(msg, 'Change Password Failed');
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
