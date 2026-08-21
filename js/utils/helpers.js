/**
 * General Helper Utilities
 */

import { CONFIG } from '../config.js';

/**
 * Construct full TMDB image URL with fallback
 */
export function getImageUrl(path, size = CONFIG.IMAGE_SIZES.POSTER_MEDIUM, fallback = CONFIG.FALLBACK_POSTER) {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  return `${CONFIG.IMAGE_BASE_URL}${size}${path}`;
}

/**
 * Construct full backdrop image URL with fallback
 */
export function getBackdropUrl(path, size = CONFIG.IMAGE_SIZES.BACKDROP_MEDIUM, fallback = CONFIG.FALLBACK_BACKDROP) {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  return `${CONFIG.IMAGE_BASE_URL}${size}${path}`;
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
