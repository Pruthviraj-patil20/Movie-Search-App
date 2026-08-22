/**
 * Authentication Service
 * Manages user state, session persistence, login, signup, and logout
 */

import { storageService } from './storage.js';
import { emitEvent } from '../utils/helpers.js';

export const AUTH_EVENT = 'cinesphere:auth-changed';
const USER_KEY = 'cinesphere_user_v1';

class AuthService {
  constructor() {
    this.user = null;
    this.preferences = null;
    this.isInitialized = false;
    this.initPromise = null;

    // Restore auth state from storage on construction
    this.restoreFromStorage();
  }

  /**
   * Restore auth state from storage
   */
  restoreFromStorage() {
    try {
      const stored = storageService.get(USER_KEY, null);
      if (stored) {
        this.user = stored.user || stored || null;
        this.preferences = stored.preferences || null;
      }
    } catch (e) {
      this.user = null;
      this.preferences = null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return Boolean(this.user && this.user.id && this.user.name);
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
   * Initialize and restore session
   */
  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = Promise.resolve();
    this.isInitialized = true;
    emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: this.isAuthenticated() });
    return this.user;
  }

  /**
   * Sign In User
   */
  async login(email, password, rememberMe = false) {
    const user = {
      id: 'user_' + Date.now(),
      name: (email ? email.split('@')[0] : 'Film Lover'),
      email: email || 'user@movies.local',
      createdAt: new Date().toISOString()
    };

    this.user = user;
    this.preferences = {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        recommendations: true,
        watchlistReminders: true
      }
    };

    storageService.set(USER_KEY, {
      user: this.user,
      preferences: this.preferences
    });

    emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: true });
    return { success: true, user: this.user };
  }

  /**
   * Sign Up User
   */
  async signup(name, email, password) {
    const user = {
      id: 'user_' + Date.now(),
      name: name || (email ? email.split('@')[0] : 'Film Lover'),
      email: email || 'user@movies.local',
      createdAt: new Date().toISOString()
    };

    this.user = user;
    this.preferences = {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        recommendations: true,
        watchlistReminders: true
      }
    };

    storageService.set(USER_KEY, {
      user: this.user,
      preferences: this.preferences
    });

    emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: true });
    return { success: true, user: this.user };
  }

  /**
   * Log Out User
   */
  async logout() {
    this.user = null;
    this.preferences = null;
    storageService.remove(USER_KEY);
    emitEvent(AUTH_EVENT, { user: null, isAuthenticated: false });
  }

  /**
   * Request Password Reset
   */
  async forgotPassword(email) {
    return { success: true, message: 'Password reset requested' };
  }

  /**
   * Reset Password With Token
   */
  async resetPassword(token, password) {
    return { success: true, message: 'Password reset completed' };
  }

  /**
   * Verify Email With Token
   */
  async verifyEmail(token) {
    if (this.user) {
      this.user.emailVerified = true;
      this.setUser(this.user);
    }
    return { success: true, message: 'Email verified' };
  }

  /**
   * Resend Verification Email
   */
  async resendVerification() {
    return { success: true, message: 'Verification link resent' };
  }

  /**
   * Update cached user data
   */
  setUser(user) {
    this.user = user;
    this.preferences = user?.preferences || this.preferences;

    storageService.set(USER_KEY, {
      user: this.user,
      preferences: this.preferences
    });

    emitEvent(AUTH_EVENT, { user: this.user, isAuthenticated: this.isAuthenticated() });
  }
}

export const authService = new AuthService();
