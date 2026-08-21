/**
 * Core TMDB API Client
 * Handles HTTP requests, query params, timeouts, errors, caching, and graceful fallbacks
 */

import { CONFIG } from '../config.js';

// In-Memory Request Cache to minimize redundant network roundtrips
const apiCache = new Map();

/**
 * Base TMDB Request Handler
 */
export async function tmdbFetch(endpoint, params = {}, options = {}) {
  const { useCache = true, cacheTtlMs = 1000 * 60 * 5, fallback = null } = options;

  // Build query string
  const queryParams = new URLSearchParams({
    api_key: CONFIG.API_KEY,
    language: 'en-US',
    ...params
  });

  const url = `${CONFIG.BASE_URL}${endpoint}?${queryParams.toString()}`;

  // Check cache
  if (useCache && apiCache.has(url)) {
    const cached = apiCache.get(url);
    if (Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data;
    }
    apiCache.delete(url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `TMDB Error (${response.status}): ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.status_message) {
          errorMessage = errorData.status_message;
        }
      } catch (e) {
        // Ignore json parse error on error response
      }

      console.warn(`[TMDB API Warning] ${errorMessage} for ${endpoint}`);

      // If fallback provided, return it gracefully
      if (fallback !== null) return fallback;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Cache successful response
    if (useCache) {
      apiCache.set(url, {
        timestamp: Date.now(),
        data
      });
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[TMDB API] Request timed out for ${endpoint}`);
    } else {
      console.error(`[TMDB API Network Error] ${error.message} for ${endpoint}`);
    }

    if (fallback !== null) {
      return fallback;
    }
    throw error;
  }
}
