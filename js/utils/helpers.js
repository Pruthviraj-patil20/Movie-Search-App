/**
 * General Helper Utilities
 */

import { CONFIG } from '../config.js';

/**
 * Helper to resolve local public assets considering Vite base URL
 */
function resolveLocalPath(path) {
  const clean = path.replace(/^(\.\/|\/)/, '');
  const base = (typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string')
    ? import.meta.env.BASE_URL
    : './';

  if (!base || base === './' || base === '') {
    return clean;
  }
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`;
}

/**
 * Construct full TMDB or local image URL with fallback
 */
export function getImageUrl(path, size = CONFIG.IMAGE_SIZES.POSTER_MEDIUM, fallback = CONFIG.FALLBACK_POSTER) {
  if (!path || typeof path !== 'string' || path.trim() === '' || path === 'null' || path === 'undefined') {
    return fallback;
  }
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  // Local project assets in public directory (e.g. images/bollywood/...)
  if (trimmed.startsWith('images/') || trimmed.startsWith('/images/') || trimmed.startsWith('./images/') || 
      trimmed.startsWith('assets/') || trimmed.startsWith('/assets/') || trimmed.startsWith('./assets/')) {
    return resolveLocalPath(trimmed);
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${CONFIG.IMAGE_BASE_URL}${size}${cleanPath}`;
}

/**
 * Construct full backdrop image URL with fallback
 */
export function getBackdropUrl(path, size = CONFIG.IMAGE_SIZES.BACKDROP_MEDIUM, fallback = CONFIG.FALLBACK_BACKDROP) {
  if (!path || typeof path !== 'string' || path.trim() === '' || path === 'null' || path === 'undefined') {
    return fallback;
  }
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  // Local project assets in public directory (e.g. images/bollywood/...)
  if (trimmed.startsWith('images/') || trimmed.startsWith('/images/') || trimmed.startsWith('./images/') || 
      trimmed.startsWith('assets/') || trimmed.startsWith('/assets/') || trimmed.startsWith('./assets/')) {
    return resolveLocalPath(trimmed);
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${CONFIG.IMAGE_BASE_URL}${size}${cleanPath}`;
}

/**
 * Safe query selector
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Safe query selector all
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Wait helper
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Dispatch custom window event
 */
export function emitEvent(eventName, detail = {}) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Add event listener shortcut
 */
export function onEvent(eventName, callback) {
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 160) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
