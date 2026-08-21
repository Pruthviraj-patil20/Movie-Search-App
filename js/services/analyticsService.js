/**
 * User Analytics Service
 */

import { apiClient } from '../api/client.js';

export const analyticsService = {
  async getUserStats() {
    try {
      const res = await apiClient.get('/api/analytics/stats');
      return res.stats || {
        totalWatched: 0,
        totalFavorites: 0,
        totalWatchlist: 0,
        totalRatings: 0,
        averageRating: 0,
        genreCounts: {},
        recentWatched: [],
        recentRatings: []
      };
    } catch (e) {
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
