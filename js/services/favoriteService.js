/**
 * Favorites Service
 * Connected directly to UserMovieService for multi-user isolation & synchronous state
 */

import { userMovieService } from './userMovieService.js';

export const FAVORITES_EVENT = 'cinesphere:favorites-updated';

export const favoriteService = {
  getFavorites() {
    return userMovieService.getFavorites();
  },

  isFavorite(movieId) {
    return userMovieService.isFavorite(movieId);
  },

  addToFavorites(movie) {
    return userMovieService.addToFavorites(movie);
  },

  removeFromFavorites(movieId) {
    return userMovieService.removeFromFavorites(movieId);
  },

  toggleFavorite(movie) {
    return userMovieService.toggleFavorite(movie);
  },

  getCount() {
    return userMovieService.getFavorites().length;
  },

  clearFavorites() {
    return userMovieService.clearFavorites();
  }
};
