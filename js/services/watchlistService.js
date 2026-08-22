/**
 * Watchlist Service
 * Connected directly to UserMovieService for multi-user isolation & synchronous state
 */

import { userMovieService } from './userMovieService.js';

export const WATCHLIST_EVENT = 'cinesphere:watchlist-updated';

export const watchlistService = {
  getWatchlist() {
    return userMovieService.getWatchlist();
  },

  isInWatchlist(movieId) {
    return userMovieService.isInWatchlist(movieId);
  },

  addToWatchlist(movie) {
    return userMovieService.addToWatchlist(movie);
  },

  removeFromWatchlist(movieId) {
    return userMovieService.removeFromWatchlist(movieId);
  },

  toggleWatchlist(movie) {
    return userMovieService.toggleWatchlist(movie);
  },

  getCount() {
    return userMovieService.getWatchlist().length;
  },

  clearWatchlist() {
    return userMovieService.clearWatchlist();
  }
};
