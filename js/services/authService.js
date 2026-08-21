/**
 * Authentication Service
 * Manages user state, session token, login, signup, and logout
 */

import { apiClient } from '../api/client.js';
import { emitEvent } from '../utils/helpers.js';

export const AUTH_EVENT = 'cinesphere:auth-changed';

class AuthService {
  constructor() {
    this.user = null;
    this.preferences = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return Boolean(this.user && this.user.id);
  }

  /**
   * Get current authenticated user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current user preferences
   */
  getPreferences() {
    return this.preferences;
  }

  /**
   * Initialize and restore session from backend
   */
  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const data = await apiClient.get('/api/auth/me');
        if (data && data.success && data.user) {
          this.user = data.user;
          this.preferences = data.preferences || null;
        } else {
          this.user = null;
          this.preferences = null;
          apiClient.removeToken();
        }
      } catch (e) {
        this.user = null;
        this.preferences = null;
      } finally {
        this.isInitialized = true;
        emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: this.isAuthenticated() });
      }
      return this.user;
    })();

    return this.initPromise;
  }

  /**
   * Sign In User
   */
  async login(email, password, rememberMe = false) {
    const data = await apiClient.post('/api/auth/login', {
      email,
      password,
      rememberMe
    });

    if (data.success && data.token) {
      apiClient.setToken(data.token);
      this.user = data.user;
      emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: true });
      return data;
    }
    throw new Error(data.error || 'Login failed');
  }

  /**
   * Sign Up User
   */
  async signup(name, email, password) {
    const data = await apiClient.post('/api/auth/signup', {
      name,
      email,
      password
    });

    if (data.success && data.token) {
      apiClient.setToken(data.token);
      this.user = data.user;
      emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: true });
      return data;
    }
    throw new Error(data.error || 'Registration failed');
  }

  /**
   * Log Out User
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      apiClient.removeToken();
      this.user = null;
      this.preferences = null;
      emitEvent(AUTH_EVENT, { user: null, isAuthenticated: false });
    }
  }

  /**
   * Request Password Reset
   */
  async forgotPassword(email) {
    return apiClient.post('/api/auth/forgot-password', { email });
  }

  /**
   * Reset Password With Token
   */
  async resetPassword(token, password) {
    return apiClient.post('/api/auth/reset-password', { token, password });
  }

  /**
   * Verify Email With Token
   */
  async verifyEmail(token) {
    const data = await apiClient.post('/api/auth/verify-email', { token });
    if (this.user) {
      this.user.emailVerified = true;
      emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: true });
    }
    return data;
  }

  /**
   * Resend Verification Email
   */
  async resendVerification() {
    return apiClient.post('/api/auth/resend-verification', {});
  }

  /**
   * Update cached user data
   */
  setUser(user) {
    this.user = user;
    emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: this.isAuthenticated() });
  }
}

export const authService = new AuthService();
