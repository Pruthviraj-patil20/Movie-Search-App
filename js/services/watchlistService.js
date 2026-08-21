/**
 * Watchlist Service
 * Handles persisting, adding, removing, and broadcasting changes for user's Watchlist
 */

import { CONFIG } from '../config.js';
import { emitEvent } from '../utils/helpers.js';
import { storageService } from './storage.js';

export const WATCHLIST_EVENT = 'cinesphere:watchlist-updated';

export const watchlistService = {
  /**
   * Get all movies in watchlist
   */
  getWatchlist() {
    return storageService.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
  },

  /**
   * Check if a movie is in watchlist
   */
  isInWatchlist(movieId) {
    const list = this.getWatchlist();
    const id = Number(movieId);
    return list.some(item => item.id === id);
  },

  /**
   * Add movie to watchlist
   */
  addToWatchlist(movie) {
    if (!movie || !movie.id) return false;
    const list = this.getWatchlist();
    const id = Number(movie.id);

    if (this.isInWatchlist(id)) {
      return false; // Already in list
    }

    const movieEntry = {
      id: id,
      title: movie.title || movie.name || 'Untitled',
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      vote_average: movie.vote_average || 0,
      release_date: movie.release_date || movie.first_air_date || '',
      genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
      added_at: new Date().toISOString()
    };

    list.unshift(movieEntry);
    storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, list);
    emitEvent(WATCHLIST_EVENT, { action: 'add', movie: movieEntry, count: list.length });
    return true;
  },

  /**
   * Remove movie from watchlist
   */
  removeFromWatchlist(movieId) {
    const id = Number(movieId);
    const list = this.getWatchlist();
    const filtered = list.filter(item => item.id !== id);

    if (filtered.length !== list.length) {
      storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, filtered);
      emitEvent(WATCHLIST_EVENT, { action: 'remove', movieId: id, count: filtered.length });
      return true;
    }
    return false;
  },

  /**
   * Toggle movie presence in watchlist
   */
  toggleWatchlist(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);
    if (this.isInWatchlist(id)) {
      this.removeFromWatchlist(id);
      return false; // Now removed
    } else {
      this.addToWatchlist(movie);
      return true; // Now added
    }
  },

  /**
   * Get total count of movies in watchlist
   */
  getCount() {
    return this.getWatchlist().length;
  },

  /**
   * Clear all movies from watchlist
   */
  clearWatchlist() {
    storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    emitEvent(WATCHLIST_EVENT, { action: 'clear', count: 0 });
    return true;
  }
};
