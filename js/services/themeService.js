/**
 * Theme Service
 * Manages Dark/Light mode, LocalStorage sync, and system preference detection
 */

import { CONFIG } from '../config.js';
import { emitEvent } from '../utils/helpers.js';
import { storageService } from './storage.js';

export const THEME_EVENT = 'cinesphere:theme-changed';

export const themeService = {
  THEMES: {
    DARK: 'dark',
    LIGHT: 'light'
  },

  /**
   * Get current active theme
   */
  getTheme() {
    const saved = storageService.get(CONFIG.STORAGE_KEYS.THEME);
    if (saved === this.THEMES.LIGHT || saved === this.THEMES.DARK) {
      return saved;
    }
    // Default to Dark cinematic theme
    return this.THEMES.DARK;
  },

  /**
   * Set and apply theme
   */
  setTheme(theme) {
    if (theme !== this.THEMES.LIGHT && theme !== this.THEMES.DARK) {
      theme = this.THEMES.DARK;
    }

    document.documentElement.setAttribute('data-theme', theme);
    storageService.set(CONFIG.STORAGE_KEYS.THEME, theme);
    emitEvent(THEME_EVENT, { theme });
    return theme;
  },

  /**
   * Toggle between Dark and Light mode
   */
  toggleTheme() {
    const current = this.getTheme();
    const next = current === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
    return this.setTheme(next);
  },

  /**
   * Initialize theme on application boot
   */
  initTheme() {
    const active = this.getTheme();
    document.documentElement.setAttribute('data-theme', active);

    // Watch for OS theme changes if user hasn't explicitly set a preference
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        const saved = storageService.get(CONFIG.STORAGE_KEYS.THEME);
        if (!saved) {
          this.setTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
        }
      });
    } catch (e) {
      // Older browsers
    }

    return active;
  }
};
