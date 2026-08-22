/**
 * Multi-User Movie Data Service
 * Maintains instantaneous in-memory caches and syncs to backend API when authenticated.
 */

import { apiClient } from '../api/client.js';
import { CONFIG } from '../config.js';
import { emitEvent } from '../utils/helpers.js';
import { authService, AUTH_EVENT } from './authService.js';
import { storageService } from './storage.js';

export const USER_MOVIES_EVENT = 'cinesphere:user-movies-updated';

class UserMovieService {
  constructor() {
    // Synchronous In-Memory State
    this.watchlist = [];
    this.favorites = [];
    this.watched = [];
    this.ratings = [];
    this.recentlyViewed = [];
    this.searchHistory = [];

    // Load from local storage initially
    this.loadFromStorage();

    // Re-sync when auth state changes
    window.addEventListener(AUTH_EVENT, () => {
      this.handleAuthChange();
    });
  }

  loadFromStorage() {
    this.watchlist = storageService.get(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    this.favorites = storageService.get(CONFIG.STORAGE_KEYS.FAVORITES, []);
    this.watched = storageService.get('cinesphere_watched_v1', []);
    this.ratings = storageService.get('cinesphere_ratings_v1', []);
    this.recentlyViewed = storageService.get('cinesphere_recent_v1', []);
    this.searchHistory = storageService.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  saveToStorage() {
    storageService.set(CONFIG.STORAGE_KEYS.WATCHLIST, this.watchlist);
    storageService.set(CONFIG.STORAGE_KEYS.FAVORITES, this.favorites);
    storageService.set('cinesphere_watched_v1', this.watched);
    storageService.set('cinesphere_ratings_v1', this.ratings);
    storageService.set('cinesphere_recent_v1', this.recentlyViewed);
    storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, this.searchHistory);
  }

  async handleAuthChange() {
    if (authService.isAuthenticated()) {
      await this.syncFromServer();
    } else {
      this.loadFromStorage();
    }
  }

  async syncFromServer() {
    if (!authService.isAuthenticated()) return;

    try {
      const [watchRes, favRes, watchedRes, ratingsRes, recentRes, historyRes] = await Promise.allSettled([
        apiClient.get('/api/user-movies/watchlist'),
        apiClient.get('/api/user-movies/favorites'),
        apiClient.get('/api/user-movies/watched'),
        apiClient.get('/api/user-movies/ratings'),
        apiClient.get('/api/user-movies/recent'),
        apiClient.get('/api/user-movies/search-history')
      ]);

      if (watchRes.status === 'fulfilled' && watchRes.value.data) {
        this.watchlist = watchRes.value.data;
      }
      if (favRes.status === 'fulfilled' && favRes.value.data) {
        this.favorites = favRes.value.data;
      }
      if (watchedRes.status === 'fulfilled' && watchedRes.value.data) {
        this.watched = watchedRes.value.data;
      }
      if (ratingsRes.status === 'fulfilled' && ratingsRes.value.data) {
        this.ratings = ratingsRes.value.data;
      }
      if (recentRes.status === 'fulfilled' && recentRes.value.data) {
        this.recentlyViewed = recentRes.value.data;
      }
      if (historyRes.status === 'fulfilled' && historyRes.value.data) {
        this.searchHistory = historyRes.value.data;
      }

      this.saveToStorage();
      emitEvent(USER_MOVIES_EVENT, { action: 'sync' });
      emitEvent('cinesphere:watchlist-updated', { count: this.watchlist.length });
      emitEvent('cinesphere:favorites-updated', { count: this.favorites.length });
    } catch (e) {
      console.warn('[UserMovieService] Sync warning:', e);
    }
  }

  // ==========================================
  // WATCHLIST
  // ==========================================

  getWatchlist() {
    return Array.isArray(this.watchlist) ? [...this.watchlist] : [];
  }

  isInWatchlist(movieId) {
    const id = Number(movieId);
    return this.watchlist.some(m => Number(m.id) === id);
  }

  addToWatchlist(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (!this.isInWatchlist(id)) {
      const cleanMovie = {
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || movie.first_air_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
        added_at: new Date().toISOString()
      };

      this.watchlist.unshift(cleanMovie);
      this.saveToStorage();

      emitEvent('cinesphere:watchlist-updated', { action: 'add', movieId: id, count: this.watchlist.length });
      emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'add', movieId: id });

      if (authService.isAuthenticated()) {
        apiClient.post('/api/user-movies/watchlist', { movie: cleanMovie }).catch(() => {});
      }
    }
    return true;
  }

  removeFromWatchlist(movieId) {
    const id = Number(movieId);
    this.watchlist = this.watchlist.filter(m => Number(m.id) !== id);
    this.saveToStorage();

    emitEvent('cinesphere:watchlist-updated', { action: 'remove', movieId: id, count: this.watchlist.length });
    emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'remove', movieId: id });

    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/watchlist/${id}`).catch(() => {});
    }
    return true;
  }

  toggleWatchlist(movie) {
    if (this.isInWatchlist(movie.id)) {
      this.removeFromWatchlist(movie.id);
      return false;
    } else {
      this.addToWatchlist(movie);
      return true;
    }
  }

  clearWatchlist() {
    this.watchlist = [];
    this.saveToStorage();

    emitEvent('cinesphere:watchlist-updated', { action: 'clear', count: 0 });
    emitEvent(USER_MOVIES_EVENT, { type: 'watchlist', action: 'clear' });

    if (authService.isAuthenticated()) {
      apiClient.delete('/api/user-movies/watchlist').catch(() => {});
    }
    return true;
  }

  // ==========================================
  // FAVORITES
  // ==========================================

  getFavorites() {
    return Array.isArray(this.favorites) ? [...this.favorites] : [];
  }

  isFavorite(movieId) {
    const id = Number(movieId);
    return this.favorites.some(m => Number(m.id) === id);
  }

  addToFavorites(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (!this.isFavorite(id)) {
      const cleanMovie = {
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || movie.first_air_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
        added_at: new Date().toISOString()
      };

      this.favorites.unshift(cleanMovie);
      this.saveToStorage();

      emitEvent('cinesphere:favorites-updated', { action: 'add', movieId: id, count: this.favorites.length });
      emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'add', movieId: id });

      if (authService.isAuthenticated()) {
        apiClient.post('/api/user-movies/favorites', { movie: cleanMovie }).catch(() => {});
      }
    }
    return true;
  }

  removeFromFavorites(movieId) {
    const id = Number(movieId);
    this.favorites = this.favorites.filter(m => Number(m.id) !== id);
    this.saveToStorage();

    emitEvent('cinesphere:favorites-updated', { action: 'remove', movieId: id, count: this.favorites.length });
    emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'remove', movieId: id });

    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/favorites/${id}`).catch(() => {});
    }
    return true;
  }

  toggleFavorite(movie) {
    if (this.isFavorite(movie.id)) {
      this.removeFromFavorites(movie.id);
      return false;
    } else {
      this.addToFavorites(movie);
      return true;
    }
  }

  clearFavorites() {
    this.favorites = [];
    this.saveToStorage();

    emitEvent('cinesphere:favorites-updated', { action: 'clear', count: 0 });
    emitEvent(USER_MOVIES_EVENT, { type: 'favorites', action: 'clear' });

    if (authService.isAuthenticated()) {
      apiClient.delete('/api/user-movies/favorites').catch(() => {});
    }
    return true;
  }

  // ==========================================
  // WATCHED MOVIES
  // ==========================================

  getWatched() {
    return Array.isArray(this.watched) ? [...this.watched] : [];
  }

  isWatched(movieId) {
    const id = Number(movieId);
    return this.watched.some(m => Number(m.id) === id);
  }

  markAsWatched(movie) {
    if (!movie || !movie.id) return false;
    const id = Number(movie.id);

    if (!this.isWatched(id)) {
      const cleanMovie = {
        id: movie.id,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || movie.first_air_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
        watched_at: new Date().toISOString()
      };

      this.watched.unshift(cleanMovie);
      this.saveToStorage();
      emitEvent(USER_MOVIES_EVENT, { type: 'watched', action: 'add', movieId: id });

      if (authService.isAuthenticated()) {
        apiClient.post('/api/user-movies/watched', { movie: cleanMovie }).catch(() => {});
      }
    }
    return true;
  }

  removeFromWatched(movieId) {
    const id = Number(movieId);
    this.watched = this.watched.filter(m => Number(m.id) !== id);
    this.saveToStorage();
    emitEvent(USER_MOVIES_EVENT, { type: 'watched', action: 'remove', movieId: id });

    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/watched/${id}`).catch(() => {});
    }
    return true;
  }

  clearWatched() {
    this.watched = [];
    this.saveToStorage();
    emitEvent(USER_MOVIES_EVENT, { type: 'watched', action: 'clear' });

    if (authService.isAuthenticated()) {
      apiClient.delete('/api/user-movies/watched').catch(() => {});
    }
    return true;
  }

  // ==========================================
  // RECENTLY VIEWED
  // ==========================================

  getRecentlyViewed() {
    return Array.isArray(this.recentlyViewed) ? [...this.recentlyViewed] : [];
  }

  addRecentlyViewed(movie) {
    if (!movie || !movie.id) return;
    const id = Number(movie.id);

    const cleanMovie = {
      id: movie.id,
      title: movie.title || movie.name || 'Untitled',
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      vote_average: movie.vote_average || 0,
      release_date: movie.release_date || movie.first_air_date || '',
      genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
    };

    this.recentlyViewed = this.recentlyViewed.filter(m => Number(m.id) !== id);
    this.recentlyViewed.unshift(cleanMovie);
    this.recentlyViewed = this.recentlyViewed.slice(0, 16);
    this.saveToStorage();

    if (authService.isAuthenticated()) {
      apiClient.post('/api/user-movies/recent', { movie: cleanMovie }).catch(() => {});
    }
  }

  removeRecentlyViewed(movieId) {
    const id = Number(movieId);
    this.recentlyViewed = this.recentlyViewed.filter(m => Number(m.id) !== id);
    this.saveToStorage();
    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/recent/${id}`).catch(() => {});
    }
  }

  clearRecentlyViewed() {
    this.recentlyViewed = [];
    this.saveToStorage();
    if (authService.isAuthenticated()) {
      apiClient.delete('/api/user-movies/recent').catch(() => {});
    }
  }

  // ==========================================
  // RATINGS (1–10)
  // ==========================================

  getRatings() {
    return Array.isArray(this.ratings) ? [...this.ratings] : [];
  }

  getMovieRating(movieId) {
    const id = Number(movieId);
    const found = this.ratings.find(r => Number(r.movieId) === id);
    return found ? found.rating : null;
  }

  rateMovie(movieId, rating, movieData = {}) {
    const id = Number(movieId);
    const score = Number(rating);

    const cleanData = {
      id: movieData.id || id,
      title: movieData.title || movieData.name || 'Movie',
      poster_path: movieData.poster_path || '',
      release_date: movieData.release_date || '',
      genre_ids: movieData.genre_ids || []
    };

    const existingIndex = this.ratings.findIndex(r => Number(r.movieId) === id);
    if (existingIndex >= 0) {
      this.ratings[existingIndex].rating = score;
      this.ratings[existingIndex].updatedAt = new Date().toISOString();
    } else {
      this.ratings.unshift({
        movieId: id,
        rating: score,
        movieData: cleanData,
        createdAt: new Date().toISOString()
      });
    }

    this.saveToStorage();
    emitEvent(USER_MOVIES_EVENT, { type: 'rating', movieId: id, rating: score });

    if (authService.isAuthenticated()) {
      apiClient.post('/api/user-movies/ratings', {
        movieId: id,
        rating: score,
        movieData: cleanData
      }).catch(() => {});
    }
    return score;
  }

  removeRating(movieId) {
    const id = Number(movieId);
    this.ratings = this.ratings.filter(r => Number(r.movieId) !== id);
    this.saveToStorage();
    emitEvent(USER_MOVIES_EVENT, { type: 'rating', movieId: id, rating: null });

    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/ratings/${id}`).catch(() => {});
    }
    return true;
  }

  // ==========================================
  // SEARCH HISTORY
  // ==========================================

  getSearchHistory() {
    return Array.isArray(this.searchHistory) ? [...this.searchHistory] : [];
  }

  addSearchHistory(query) {
    if (!query || !query.trim()) return;
    const clean = query.trim();

    this.searchHistory = this.searchHistory.filter(q => q.toLowerCase() !== clean.toLowerCase());
    this.searchHistory.unshift(clean);
    this.searchHistory = this.searchHistory.slice(0, CONFIG.MAX_SEARCH_HISTORY);
    this.saveToStorage();

    if (authService.isAuthenticated()) {
      apiClient.post('/api/user-movies/search-history', { query: clean }).catch(() => {});
    }
  }

  removeSearchHistory(query) {
    this.searchHistory = this.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
    this.saveToStorage();
    if (authService.isAuthenticated()) {
      apiClient.delete(`/api/user-movies/search-history/${encodeURIComponent(query)}`).catch(() => {});
    }
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.saveToStorage();
    if (authService.isAuthenticated()) {
      apiClient.delete('/api/user-movies/search-history').catch(() => {});
    }
  }
}

export const userMovieService = new UserMovieService();
