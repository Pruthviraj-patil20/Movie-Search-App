/**
 * User Analytics Service
 * Pure frontend - computes stats from localStorage data.
 * No backend API required.
 */

import { userMovieService } from './userMovieService.js';
import { CONFIG } from '../config.js';

export const analyticsService = {
  async getUserStats() {
    try {
      const watched = userMovieService.getWatched();
      const favorites = userMovieService.getFavorites();
      const watchlist = userMovieService.getWatchlist();
      const ratings = userMovieService.getRatings();

      // Calculate average rating
      let avgRating = 0;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        avgRating = Number((sum / ratings.length).toFixed(1));
      }

      // Calculate genre breakdown from watched, favorites, and watchlist
      const genreCount = {};
      const countGenres = (items) => {
        items.forEach(item => {
          const m = item.movieData || item;
          const genres = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
          genres.forEach(gid => {
            genreCount[gid] = (genreCount[gid] || 0) + 1;
          });
        });
      };

      countGenres(watched);
      countGenres(favorites);
      countGenres(watchlist);

      // Recent watched (last 5)
      const recentWatched = watched.slice(0, 5).map(m => ({
        ...m,
        watched_at: m.watched_at || m.added_at
      }));

      // Recent ratings
      const recentRatings = ratings.slice(0, 5).map(r => ({
        movieId: r.movieId,
        rating: r.rating,
        title: r.movieData ? r.movieData.title : 'Unknown'
      }));

      return {
        totalWatched: watched.length,
        totalFavorites: favorites.length,
        totalWatchlist: watchlist.length,
        totalRatings: ratings.length,
        averageRating: avgRating,
        genreCounts: genreCount,
        recentWatched: recentWatched,
        recentRatings: recentRatings
      };
    } catch (error) {
      console.warn('[AnalyticsService] Error computing stats from localStorage:', error);
      return {
        totalWatched: 0,
        totalFavorites: 0,
        totalWatchlist: 0,
        totalRatings: 0,
        averageRating: 0,
        genreCounts: {},
        recentWatched: [],
        recentRatings: []
      };
    }
  }
};