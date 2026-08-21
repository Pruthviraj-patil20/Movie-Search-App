/**
 * User Profile & Settings Service
 */

import { apiClient } from '../api/client.js';
import { authService } from './authService.js';

export const userService = {
  /**
   * Update Profile Information
   */
  async updateProfile(data) {
    const res = await apiClient.put('/api/users/profile', data);
    if (res.success && res.user) {
      authService.setUser(res.user);
    }
    return res;
  },

  /**
   * Upload Profile Photo
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient.post('/api/users/avatar', formData);
    if (res.success && res.user) {
      authService.setUser(res.user);
    }
    return res;
  },

  /**
   * Remove Custom Profile Photo
   */
  async removeAvatar() {
    const res = await apiClient.delete('/api/users/avatar');
    if (res.success && res.user) {
      authService.setUser(res.user);
    }
    return res;
  },

  /**
   * Change Password
   */
  async changePassword(currentPassword, newPassword) {
    return apiClient.put('/api/users/password', { currentPassword, newPassword });
  },

  /**
   * Update User Preferences
   */
  async updatePreferences(preferences) {
    return apiClient.put('/api/users/preferences', preferences);
  },

  /**
   * Delete Account Permanently
   */
  async deleteAccount(password) {
    const res = await apiClient.delete('/api/users/account', {
      body: JSON.stringify({ password })
    });
    await authService.logout();
    return res;
  }
};
