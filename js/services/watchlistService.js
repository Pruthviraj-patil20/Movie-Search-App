/**
 * Watchlist Service
 * Connected directly to UserMovieService for multi-user isolation
 */

import { userMovieService } from './userMovieService.js';

export const WATCHLIST_EVENT = 'cinesphere:watchlist-updated';

export const watchlistService = {
  async getWatchlist() {
    return userMovieService.getWatchlist();
  },

  async isInWatchlist(movieId) {
    return userMovieService.isInWatchlist(movieId);
  },

  async addToWatchlist(movie) {
    return userMovieService.addToWatchlist(movie);
  },

  async removeFromWatchlist(movieId) {
    return userMovieService.removeFromWatchlist(movieId);
  },

  async toggleWatchlist(movie) {
    return userMovieService.toggleWatchlist(movie);
  },

  async getCount() {
    const list = await this.getWatchlist();
    return list.length;
  },

  async clearWatchlist() {
    return userMovieService.clearWatchlist();
  }
};
