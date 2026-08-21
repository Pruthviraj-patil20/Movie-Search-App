/**
 * Favorites Service
 * Handles persisting, adding, removing, and broadcasting changes for user's Favorites
 */

import { CONFIG } from '../config.js';
import { emitEvent } from '../utils/helpers.js';
import { storageService } from './storage.js';

export const FAVORITES_EVENT = 'cinesphere:favorites-updated';

export const favoriteService = {
  /**
   * Get all favorite movies
   */
  getFavorites() {
    return storageService.get(CONFIG.STORAGE_KEYS.FAVORITES, []);
  },

  /**
   * Check if a movie is in favorites
   */
  isFavorite(movieId) {
    const list = this.getFavorites();
    const id = Number(movieId);
    return list.some(item => item.id === id);
  },

  /**
   * Add movie to favorites
   */
  addToFavorites(movie) {
    if (!movie || !movie.id) return false;
    const list = this.getFavorites();
    const id = Number(movie.id);

    if (this.isFavorite(id)) {
      return false; // Already favorite
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
    storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, list);
    emitEvent(FAVORITES_EVENT, { action: 'add', movie: movieEntry, count: list.length });
    return true;
  },

  /**
   * Remove movie from favorites
   */
  removeFromFavorites(movieId) {
    const id = Number(movieId);
    const list = this.getFavorites();
    const filtered = list.filter(item => item.id !== id);

    if (filtered.length !== list.length) {
      storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, filtered);
      emitEvent(FAVORITES_EVENT, { action: 'remove', movieId: id, count: filtered.length });
      return true;
    }
    return false;
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);
    if (this.isFavorite(id)) {
      this.removeFromFavorites(id);
      return false; // Now removed
    } else {
      this.addToFavorites(movie);
      return true; // Now added
    }
  },

  /**
   * Get count of favorite movies
   */
  getCount() {
    return this.getFavorites().length;
  },

  /**
   * Clear all favorites
   */
  clearFavorites() {
    storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, []);
    emitEvent(FAVORITES_EVENT, { action: 'clear', count: 0 });
    return true;
  }
};
