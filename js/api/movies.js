/**
 * TMDB Movies API Module
 * Complete suite of movie queries and discovery endpoints
 */

import { CONFIG } from '../config.js';
import { tmdbFetch } from './tmdb.js';

/**
 * Trending Movies (day / week)
 */
export async function getTrendingMovies(timeWindow = 'day', page = 1) {
  try {
    const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
    return data;
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Popular Movies
 */
export async function getPopularMovies(page = 1) {
  try {
    return await tmdbFetch('/movie/popular', { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Top Rated Movies
 */
export async function getTopRatedMovies(page = 1) {
  try {
    return await tmdbFetch('/movie/top_rated', { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Upcoming Movies
 */
export async function getUpcomingMovies(page = 1) {
  try {
    return await tmdbFetch('/movie/upcoming', { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Now Playing Movies
 */
export async function getNowPlayingMovies(page = 1) {
  try {
    return await tmdbFetch('/movie/now_playing', { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Movie Details with Credits, Videos, Release Dates, and Recommendations
 */
export async function getMovieDetails(movieId) {
  if (!movieId) throw new Error('Movie ID is required');
  try {
    return await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,similar,recommendations,release_dates'
    });
  } catch (error) {
    // If specific ID fails, try fallback
    const demo = CONFIG.DEMO_MOVIES.find(m => m.id === Number(movieId)) || CONFIG.DEMO_MOVIES[0];
    return {
      ...demo,
      genres: demo.genre_ids ? demo.genre_ids.map(id => ({ id, name: 'Cinema' })) : [],
      credits: { cast: [] },
      videos: { results: [] },
      similar: { results: [] },
      recommendations: { results: [] }
    };
  }
}

/**
 * Search Movies with Query & Filters
 */
export async function searchMovies(query, page = 1, filters = {}) {
  if (!query || !query.trim()) {
    // If no query string, use discover endpoint
    return discoverMovies({ ...filters, page });
  }

  const params = {
    query: query.trim(),
    page,
    include_adult: false
  };

  if (filters.year) {
    params.primary_release_year = filters.year;
  }
  if (filters.language) {
    params.language = filters.language;
  }

  try {
    const data = await tmdbFetch('/search/movie', params, {
      fallback: { results: [], total_results: 0, total_pages: 0 }
    });

    // Client-side filtering if genre or minRating applied to search query
    let results = data.results || [];
    if (filters.genre) {
      const genreId = Number(filters.genre);
      results = results.filter(m => m.genre_ids && m.genre_ids.includes(genreId));
    }
    if (filters.minRating) {
      const minScore = Number(filters.minRating);
      results = results.filter(m => (m.vote_average || 0) >= minScore);
    }

    return {
      ...data,
      results
    };
  } catch (error) {
    return { results: [], total_results: 0, total_pages: 0 };
  }
}

/**
 * Discover Movies with Advanced Filtering
 */
export async function discoverMovies(filters = {}) {
  const params = {
    page: filters.page || 1,
    include_adult: false,
    include_video: false
  };

  if (filters.genre) {
    params.with_genres = filters.genre;
  }
  if (filters.year) {
    params.primary_release_year = filters.year;
  }
  if (filters.minRating) {
    params['vote_average.gte'] = filters.minRating;
    params['vote_count.gte'] = 50; // Filter out 1-vote anomalies
  }
  if (filters.language) {
    params.with_original_language = filters.language;
  }
  if (filters.sortBy) {
    params.sort_by = filters.sortBy;
  } else {
    params.sort_by = 'popularity.desc';
  }

  try {
    return await tmdbFetch('/discover/movie', params, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_results: CONFIG.DEMO_MOVIES.length, total_pages: 1 }
    });
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_results: 0, total_pages: 0 };
  }
}

/**
 * Similar Movies
 */
export async function getSimilarMovies(movieId, page = 1) {
  try {
    return await tmdbFetch(`/movie/${movieId}/similar`, { page }, {
      fallback: { results: [] }
    });
  } catch (error) {
    return { results: [] };
  }
}

/**
 * Recommended Movies
 */
export async function getRecommendations(movieId, page = 1) {
  try {
    return await tmdbFetch(`/movie/${movieId}/recommendations`, { page }, {
      fallback: { results: [] }
    });
  } catch (error) {
    return { results: [] };
  }
}

/**
 * Movies By Genre
 */
export async function getMoviesByGenre(genreId, page = 1) {
  return discoverMovies({ genre: genreId, page, sortBy: 'popularity.desc' });
}
