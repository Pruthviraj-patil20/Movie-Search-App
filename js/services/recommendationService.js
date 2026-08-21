/**
 * Personalized Movie Recommendation Engine
 * Analyzes user favorites, watchlist, and ratings to dynamically discover tailored movies
 */

import { discoverMovies, getPopularMovies, getRecommendations } from '../api/movies.js';
import { userMovieService } from './userMovieService.js';

export const recommendationService = {
  /**
   * Get dynamic personalized recommendations
   */
  async getPersonalizedRecommendations() {
    try {
      const [favorites, watched, ratings] = await Promise.all([
        userMovieService.getFavorites(),
        userMovieService.getWatched(),
        userMovieService.getRatings()
      ]);

      // 1. If user has rated or favorited movies, pick their favorite and query TMDB recommendations
      const highRated = ratings.filter(r => r.rating >= 7);
      const seedMovies = [...favorites, ...highRated.map(r => r.movieData).filter(Boolean), ...watched];

      if (seedMovies.length > 0) {
        // Pick top seed movie
        const seed = seedMovies[0];
        if (seed && seed.id) {
          const recsData = await getRecommendations(seed.id);
          if (recsData && recsData.results && recsData.results.length > 0) {
            return {
              reason: `Because you liked "${seed.title}"`,
              seedMovie: seed,
              movies: recsData.results.slice(0, 16)
            };
          }
        }
      }

      // 2. Discover by top genres if available
      const genreCount = {};
      seedMovies.forEach(m => {
        const gids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
        gids.forEach(gid => {
          genreCount[gid] = (genreCount[gid] || 0) + 1;
        });
      });

      const topGenreEntry = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
      if (topGenreEntry) {
        const genreId = topGenreEntry[0];
        const discoverData = await discoverMovies({ genre: genreId, sortBy: 'popularity.desc' });
        if (discoverData && discoverData.results && discoverData.results.length > 0) {
          return {
            reason: `Top picks based on your favorite genres`,
            movies: discoverData.results.slice(0, 16)
          };
        }
      }

      // 3. Fallback to global popular hits
      const popData = await getPopularMovies(1);
      return {
        reason: 'Recommended for You',
        movies: (popData.results || []).slice(0, 16)
      };
    } catch (e) {
      console.warn('[RecommendationService] Error generating recommendations:', e);
      const popData = await getPopularMovies(1);
      return {
        reason: 'Popular Hits For You',
        movies: (popData.results || []).slice(0, 16)
      };
    }
  }
};
