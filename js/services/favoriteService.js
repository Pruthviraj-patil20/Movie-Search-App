/**
 * Favorites Service
 * Connected directly to UserMovieService for multi-user isolation
 */

import { userMovieService } from './userMovieService.js';

export const FAVORITES_EVENT = 'cinesphere:favorites-updated';

export const favoriteService = {
  async getFavorites() {
    return userMovieService.getFavorites();
  },

  async isFavorite(movieId) {
    return userMovieService.isFavorite(movieId);
  },

  async addToFavorites(movie) {
    return userMovieService.addToFavorites(movie);
  },

  async removeFromFavorites(movieId) {
    return userMovieService.removeFromFavorites(movieId);
  },

  async toggleFavorite(movie) {
    return userMovieService.toggleFavorite(movie);
  },

  async getCount() {
    const list = await this.getFavorites();
    return list.length;
  },

  async clearFavorites() {
    return userMovieService.clearFavorites();
  }
};
