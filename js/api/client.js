/**
 * CineSphere Backend API Client
 * Centralized fetch handler with credentials, auth header injection, and error formatting
 */

import { storageService } from '../services/storage.js';

const TOKEN_KEY = 'cinesphere_auth_token_v1';

export const apiClient = {
  getToken() {
    return storageService.get(TOKEN_KEY, null);
  },

  setToken(token) {
    if (token) {
      storageService.set(TOKEN_KEY, token);
    } else {
      storageService.remove(TOKEN_KEY);
    }
  },

  removeToken() {
    storageService.remove(TOKEN_KEY);
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    // Don't set Content-Type if uploading FormData (let browser set multipart boundary)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include' // Send cookies
    };

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (error) {
      console.warn(`[API Client] ${options.method || 'GET'} ${endpoint} failed:`, error.message);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body = {}, options = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};
