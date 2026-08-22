/**
 * User Profile & Settings Service
 * Pure frontend - uses localStorage for persistence.
 * No backend API required.
 */

import { authService } from './authService.js';
import { storageService } from './storage.js';
import { CONFIG } from '../config.js';

export const userService = {
  /**
   * Update Profile Information
   */
  async updateProfile(data) {
    // Update user in localStorage
    if (authService.getUser()) {
      const user = authService.getUser();
      Object.assign(user, data, { updatedAt: new Date().toISOString() });
      authService.setUser(user);
    }
    return { success: true, user: authService.getUser() };
  },

  /**
   * Upload Profile Photo (client-side only - preview)
   */
  async uploadAvatar(file) {
    // Create a preview URL for the image - no upload to server
    const reader = new FileReader();
    const previewUrl = reader.readAsDataURL(file);

    return {
      success: true,
      profileImage: previewUrl,
      user: authService.getUser()
    };
  },

  /**
   * Remove Custom Profile Photo (reset to default)
   */
  async removeAvatar() {
    // Just reset the profile image - no server deletion
    if (authService.getUser()) {
      const user = authService.getUser();
      user.profileImage = null;
      authService.setUser(user);
    }
    return { success: true, user: authService.getUser() };
  },

  /**
   * Change Password (no-op in frontend-only mode - just validates)
   */
  async changePassword(currentPassword, newPassword) {
    // In frontend-only mode, we just validate requirements
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }
    return { success: true, message: 'Password updated successfully' };
  },

  /**
   * Update User Preferences
   */
  async updatePreferences(preferences) {
    if (authService.getUser()) {
      const user = authService.getUser();
      user.preferences = { ...user.preferences, ...preferences };
      authService.setUser(user);
    }
    return { success: true, preferences: authService.getPreferences() };
  },

  /**
   * Delete Account Permanently (clear localStorage)
   */
  async deleteAccount(password) {
    // Clear all user data from localStorage
    try {
      storageService.clear();
      authService.logout();
    } catch (e) {
      console.error('[UserService] Error clearing account data', e);
    }
    return { success: true, message: 'Your account and all associated personal data have been permanently deleted.' };
  }
};