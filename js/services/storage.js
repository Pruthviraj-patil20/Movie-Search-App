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
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('[StorageService] Error clearing localStorage:', error);
      return false;
    }
  }
};
