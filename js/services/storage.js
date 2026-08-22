/**
 * Centralized Safe LocalStorage Service
 * Handles quota limits, corrupt data, private browsing and JSON parsing safely
 */

export const storageService = {
  /**
   * Get an item from localStorage with fallback
   */
  get(key, fallbackValue = null) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return fallbackValue;
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return fallbackValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[StorageService] Error reading key "${key}":`, error);
      return fallbackValue;
    }
  },

  /**
   * Save an item to localStorage
   */
  set(key, value) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageService] Error writing key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove an item from localStorage
   */
  remove(key) {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Error removing key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all items or keys matching prefix
   */
  clear() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[StorageService] Error clearing localStorage:', error);
      return false;
    }
  }
};
