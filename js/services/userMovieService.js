/**
 * Multi-User Movie Data Service
 * Bridges to backend API when authenticated and provides seamless fallback
 */

import { apiClient } from '../api/client.js';
import { CONFIG } from '../config.js';
import { emitEvent } from '../utils/helpers.js';
import { authService } from './authService.js';
import { storageService } from './storage.js';

export const USER_MOVIES_EVENT = 'cinesphere:user-movies-updated';

class UserMovieService {
  constructor() {
    // In-memory caches
    this.watchlistCache = null;
    this.favoritesCache = null;
    this.watchedCache = null;
    this.ratingsCache = null;

    // Reset caches on auth state change
    window.addEventListener('cinesphere:auth-changed', () => {
      this.clearCaches();
    });
  }

  clearCaches() {
    this.watchlistCache = null;
    this.favoritesCache = null;
    this.watchedCache = null;
    this.ratingsCache = null;
  }

  // ==========================================
  // WATCHLIST
  // ==========================================

  async getWatchlist() {
    if (authService.isAuthenticated()) {
      if (this.watchlistCache) return this.watchlistCache;
      try {
        const res = await apiClient.get('/api/user-movies/watchlist');
        this.watchlistCache = res.data || [];
        return this.watchlistCache;
      } catch (e) {
        return [];
      }
    }
    return storageService.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
  }

  async isInWatchlist(movieId) {
    const list = await this.getWatchlist();
    const id = Number(movieId);
    return list.some(item => item.id === id);
  }

  async addToWatchlist(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (authService.isAuthenticated()) {
      try {
        await apiClient.post('/api/user-movies/watchlist', { movie });
        this.watchlistCache = null;
        emitEvent('cinesphere:watchlist-updated', { action: 'add', movieId: id });
        emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'add', movieId: id });
        return true;
      } catch (e) {
        return false;
      }
    }

    // Guest fallback
    const list = storageService.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    if (!list.some(m => m.id === id)) {
      list.unshift(movie);
      storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, list);
      emitEvent('cinesphere:watchlist-updated', { action: 'add', movieId: id, count: list.length });
    }
    return true;
  }

  async removeFromWatchlist(movieId) {
    const id = Number(movieId);

    if (authService.isAuthenticated()) {
      try {
        await apiClient.delete(`/api/user-movies/watchlist/${id}`);
        this.watchlistCache = null;
        emitEvent('cinesphere:watchlist-updated', { action: 'remove', movieId: id });
        emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'remove', movieId: id });
        return true;
      } catch (e) {
        return false;
      }
    }

    // Guest fallback
    let list = storageService.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    list = list.filter(m => m.id !== id);
    storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, list);
    emitEvent('cinesphere:watchlist-updated', { action: 'remove', movieId: id, count: list.length });
    return true;
  }

  async toggleWatchlist(movie) {
    const isSaved = await this.isInWatchlist(movie.id);
    if (isSaved) {
      await this.removeFromWatchlist(movie.id);
      return false;
    } else {
      await this.addToWatchlist(movie);
      return true;
    }
  }

  async clearWatchlist() {
    if (authService.isAuthenticated()) {
      await apiClient.delete('/api/user-movies/watchlist');
      this.watchlistCache = [];
    } else {
      storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    }
    emitEvent('cinesphere:watchlist-updated', { action: 'clear', count: 0 });
    emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'clear' });
    return true;
  }

  // ==========================================
  // FAVORITES
  // ==========================================

  async getFavorites() {
    if (authService.isAuthenticated()) {
      if (this.favoritesCache) return this.favoritesCache;
      try {
        const res = await apiClient.get('/api/user-movies/favorites');
        this.favoritesCache = res.data || [];
        return this.favoritesCache;
      } catch (e) {
        return [];
      }
    }
    return storageService.get(CONFIG.STORAGE_KEYS.FAVORITES, []);
  }

  async isFavorite(movieId) {
    const list = await this.getFavorites();
    const id = Number(movieId);
    return list.some(item => item.id === id);
  }

  async addToFavorites(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (authService.isAuthenticated()) {
      try {
        await apiClient.post('/api/user-movies/favorites', { movie });
        this.favoritesCache = null;
        emitEvent('cinesphere:favorites-updated', { action: 'add', movieId: id });
        emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'add', movieId: id });
        return true;
      } catch (e) {
        return false;
      }
    }

    // Guest fallback
    const list = storageService.get(CONFIG.STORAGE_KEYS.FAVORITES, []);
    if (!list.some(m => m.id === id)) {
      list.unshift(movie);
      storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, list);
      emitEvent('cinesphere:favorites-updated', { action: 'add', movieId: id, count: list.length });
    }
    return true;
  }

  async removeFromFavorites(movieId) {
    const id = Number(movieId);

    if (authService.isAuthenticated()) {
      try {
        await apiClient.delete(`/api/user-movies/favorites/${id}`);
        this.favoritesCache = null;
        emitEvent('cinesphere:favorites-updated', { action: 'remove', movieId: id });
        emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'remove', movieId: id });
        return true;
      } catch (e) {
        return false;
      }
    }

    // Guest fallback
    let list = storageService.get(CONFIG.STORAGE_KEYS.FAVORITES, []);
    list = list.filter(m => m.id !== id);
    storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, list);
    emitEvent('cinesphere:favorites-updated', { action: 'remove', movieId: id, count: list.length });
    return true;
  }

  async toggleFavorite(movie) {
    const isFav = await this.isFavorite(movie.id);
    if (isFav) {
      await this.removeFromFavorites(movie.id);
      return false;
    } else {
      await this.addToFavorites(movie);
      return true;
    }
  }

  async clearFavorites() {
    if (authService.isAuthenticated()) {
      await apiClient.delete('/api/user-movies/favorites');
      this.favoritesCache = [];
    } else {
      storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, []);
    }
    emitEvent('cinesphere:favorites-updated', { action: 'clear', count: 0 });
    emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'clear' });
    return true;
  }

  // ==========================================
  // WATCHED MOVIES
  // ==========================================

  async getWatched() {
    if (authService.isAuthenticated()) {
      if (this.watchedCache) return this.watchedCache;
      try {
        const res = await apiClient.get('/api/user-movies/watched');
        this.watchedCache = res.data || [];
        return this.watchedCache;
      } catch (e) {
        return [];
      }
    }
    return storageService.get('cinesphere_watched_v1', []);
  }

  async isWatched(movieId) {
    const list = await this.getWatched();
    const id = Number(movieId);
    return list.some(item => item.id === id);
  }

  async markAsWatched(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (authService.isAuthenticated()) {
      try {
        await apiClient.post('/api/user-movies/watched', { movie });
        this.watchedCache = null;
        emitEvent(USER_MOVIES_EVENT, { type: 'watched', action: 'add', movieId: id });
        return true;
      } catch (e) {
        return false;
      }
    }

    const list = storageService.get('cinesphere_watched_v1', []);
    if (!list.some(m => m.id === id)) {
      list.unshift(movie);
      storageService.set('cinesphere_watched_v1', list);
    }
    return true;
  }

  async removeFromWatched(movieId) {
    const id = Number(movieId);
    if (authService.isAuthenticated()) {
      await apiClient.delete(`/api/user-movies/watched/${id}`);
      this.watchedCache = null;
      emitEvent(USER_MOVIES_EVENT, { type: 'watched', action: 'remove', movieId: id });
      return true;
    }

    let list = storageService.get('cinesphere_watched_v1', []);
    list = list.filter(m => m.id !== id);
    storageService.set('cinesphere_watched_v1', list);
    return true;
  }

  // ==========================================
  // RECENTLY VIEWED
  // ==========================================

  async getRecentlyViewed() {
    if (authService.isAuthenticated()) {
      try {
        const res = await apiClient.get('/api/user-movies/recent');
        return res.data || [];
      } catch (e) {
        return [];
      }
    }
    return storageService.get('cinesphere_recent_v1', []);
  }

  async addRecentlyViewed(movie) {
    if (!movie || !movie.id) return;
    if (authService.isAuthenticated()) {
      try {
        await apiClient.post('/api/user-movies/recent', { movie });
      } catch (e) {}
    } else {
      let list = storageService.get('cinesphere_recent_v1', []);
      list = list.filter(m => m.id !== Number(movie.id));
      list.unshift(movie);
      storageService.set('cinesphere_recent_v1', list.slice(0, 15));
    }
  }

  // ==========================================
  // RATINGS (1–10)
  // ==========================================

  async getRatings() {
    if (authService.isAuthenticated()) {
      if (this.ratingsCache) return this.ratingsCache;
      try {
        const res = await apiClient.get('/api/user-movies/ratings');
        this.ratingsCache = res.data || [];
        return this.ratingsCache;
      } catch (e) {
        return [];
      }
    }
    return storageService.get('cinesphere_ratings_v1', []);
  }

  async getMovieRating(movieId) {
    const id = Number(movieId);
    if (authService.isAuthenticated()) {
      try {
        const res = await apiClient.get(`/api/user-movies/ratings/${id}`);
        return res.rating || null;
      } catch (e) {
        return null;
      }
    }
    const list = storageService.get('cinesphere_ratings_v1', []);
    const found = list.find(r => r.movieId === id);
    return found ? found.rating : null;
  }

  async rateMovie(movieId, rating, movieData = {}) {
    const id = Number(movieId);
    const score = Number(rating);

    if (authService.isAuthenticated()) {
      const res = await apiClient.post('/api/user-movies/ratings', {
        movieId: id,
        rating: score,
        movieData
      });
      this.ratingsCache = null;
      emitEvent(USER_MOVIES_EVENT, { type: 'rating', movieId: id, rating: score });
      return res.rating;
    }

    let list = storageService.get('cinesphere_ratings_v1', []);
    const existing = list.find(r => r.movieId === id);
    if (existing) {
      existing.rating = score;
    } else {
      list.push({ movieId: id, rating: score, movieData });
    }
    storageService.set('cinesphere_ratings_v1', list);
    emitEvent(USER_MOVIES_EVENT, { type: 'rating', movieId: id, rating: score });
    return score;
  }

  async removeRating(movieId) {
    const id = Number(movieId);
    if (authService.isAuthenticated()) {
      await apiClient.delete(`/api/user-movies/ratings/${id}`);
      this.ratingsCache = null;
      emitEvent(USER_MOVIES_EVENT, { type: 'rating', movieId: id, rating: null });
      return true;
    }
    let list = storageService.get('cinesphere_ratings_v1', []);
    list = list.filter(r => r.movieId !== id);
    storageService.set('cinesphere_ratings_v1', list);
    return true;
  }

  // ==========================================
  // SEARCH HISTORY
  // ==========================================

  async getSearchHistory() {
    if (authService.isAuthenticated()) {
      try {
        const res = await apiClient.get('/api/user-movies/search-history');
        return res.data || [];
      } catch (e) {
        return [];
      }
    }
    return storageService.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  async addSearchHistory(query) {
    if (!query) return;
    if (authService.isAuthenticated()) {
      try {
        await apiClient.post('/api/user-movies/search-history', { query });
      } catch (e) {}
    } else {
      let list = storageService.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
      list = list.filter(q => q.toLowerCase() !== query.toLowerCase());
      list.unshift(query);
      storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, list.slice(0, 8));
    }
  }

  async removeSearchHistory(query) {
    if (authService.isAuthenticated()) {
      await apiClient.delete(`/api/user-movies/search-history/${encodeURIComponent(query)}`);
    } else {
      let list = storageService.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
      list = list.filter(q => q.toLowerCase() !== query.toLowerCase());
      storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, list);
    }
  }

  async clearSearchHistory() {
    if (authService.isAuthenticated()) {
      await apiClient.delete('/api/user-movies/search-history');
    } else {
      storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
    }
  }
}

export const userMovieService = new UserMovieService();
