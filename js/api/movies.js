/**
 * TMDB Movies API Module
 * Complete suite of movie queries, discovery endpoints, and zero-failure fallbacks
 */

import { CONFIG } from '../config.js';
import { tmdbFetch } from './tmdb.js';

/**
 * Filter and sort local fallback movies
 */
function getCuratedFallback(filters = {}) {
  let list = [...CONFIG.DEMO_MOVIES];

  if (filters.genre) {
    const gid = Number(filters.genre);
    const filtered = list.filter(m => m.genre_ids && m.genre_ids.includes(gid));
    if (filtered.length > 0) list = filtered;
  }
  if (filters.minRating) {
    const min = Number(filters.minRating);
    const filtered = list.filter(m => (m.vote_average || 0) >= min);
    if (filtered.length > 0) list = filtered;
  }
  if (filters.sortBy) {
    if (filters.sortBy === 'vote_average.desc') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (filters.sortBy === 'primary_release_date.desc') {
      list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    } else if (filters.sortBy === 'title.asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      list.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }
  }

  return list;
}

/**
 * Trending Movies (day / week)
 */
export async function getTrendingMovies(timeWindow = 'day', page = 1) {
  try {
    const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES, total_pages: 1 }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES, total_pages: 1 };
  }
}

/**
 * Popular Movies
 */
export async function getPopularMovies(page = 1) {
  const fallback = [...CONFIG.DEMO_MOVIES].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  try {
    const data = await tmdbFetch('/movie/popular', { page }, {
      fallback: { results: fallback, total_pages: 1 }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: fallback, total_pages: 1 };
  } catch (error) {
    return { results: fallback, total_pages: 1 };
  }
}

/**
 * Top Rated Movies
 */
export async function getTopRatedMovies(page = 1) {
  const fallback = [...CONFIG.DEMO_MOVIES].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  try {
    const data = await tmdbFetch('/movie/top_rated', { page }, {
      fallback: { results: fallback, total_pages: 1 }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: fallback, total_pages: 1 };
  } catch (error) {
    return { results: fallback, total_pages: 1 };
  }
}

/**
 * Upcoming Movies
 */
export async function getUpcomingMovies(page = 1) {
  const fallback = [...CONFIG.DEMO_MOVIES].sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
  try {
    const data = await tmdbFetch('/movie/upcoming', { page }, {
      fallback: { results: fallback, total_pages: 1 }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: fallback, total_pages: 1 };
  } catch (error) {
    return { results: fallback, total_pages: 1 };
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
    const data = await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: 'credits,videos,similar,recommendations,release_dates'
    });
    if (data && data.id) return data;
    throw new Error('Not found');
  } catch (error) {
    const demo = CONFIG.DEMO_MOVIES.find(m => m.id === Number(movieId)) || CONFIG.DEMO_MOVIES[0];
    return {
      ...demo,
      runtime: 148,
      status: 'Released',
      tagline: 'Your mind is the scene of the crime.',
      budget: 160000000,
      revenue: 836836967,
      genres: demo.genre_ids ? demo.genre_ids.map(id => ({ id, name: 'Cinema' })) : [],
      production_companies: [{ name: 'Warner Bros. Pictures' }, { name: 'Syncopy' }],
      credits: {
        cast: [
          { name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/wo2ViewsMe4I5NYNiQ7vAhneRpt.jpg' },
          { name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: '/dhv9f3A7e38NfGz43pD2Lg3n0mQ.jpg' },
          { name: 'Elliot Page', character: 'Ariadne', profile_path: '/c5k0U2Gv2bT55uA8bM8J2u55Q1b.jpg' },
          { name: 'Tom Hardy', character: 'Eames', profile_path: '/d8seqNtQ51gfeIqQ9w3rP47j4w7.jpg' },
          { name: 'Cillian Murphy', character: 'Robert Fischer', profile_path: '/iRz3p6p2Ue62b0833Z44qQ98r9A.jpg' }
        ]
      },
      videos: {
        results: [
          { key: 'YoHD9XEInc0', type: 'Trailer', site: 'YouTube' }
        ]
      },
      similar: { results: CONFIG.DEMO_MOVIES.slice(1, 7) },
      recommendations: { results: CONFIG.DEMO_MOVIES.slice(2, 8) }
    };
  }
}

/**
 * Search Movies with Query & Filters
 */
export async function searchMovies(query, page = 1, filters = {}) {
  if (!query || !query.trim()) {
    return discoverMovies({ ...filters, page });
  }

  const q = query.toLowerCase().trim();
  const fallback = CONFIG.DEMO_MOVIES.filter(m =>
    (m.title && m.title.toLowerCase().includes(q)) ||
    (m.overview && m.overview.toLowerCase().includes(q))
  );

  const params = {
    query: query.trim(),
    page,
    include_adult: false
  };

  if (filters.year) params.primary_release_year = filters.year;
  if (filters.language) params.language = filters.language;

  try {
    const data = await tmdbFetch('/search/movie', params, {
      fallback: { results: fallback, total_results: fallback.length, total_pages: 1 }
    });

    let results = (data && Array.isArray(data.results) && data.results.length > 0) ? data.results : fallback;

    if (filters.genre) {
      const genreId = Number(filters.genre);
      results = results.filter(m => m.genre_ids && m.genre_ids.includes(genreId));
    }
    if (filters.minRating) {
      const minScore = Number(filters.minRating);
      results = results.filter(m => (m.vote_average || 0) >= minScore);
    }

    return {
      results,
      total_results: results.length,
      total_pages: 1
    };
  } catch (error) {
    return { results: fallback, total_results: fallback.length, total_pages: 1 };
  }
}

/**
 * Discover Movies with Advanced Filtering
 */
export async function discoverMovies(filters = {}) {
  const fallback = getCuratedFallback(filters);

  const params = {
    page: filters.page || 1,
    include_adult: false,
    include_video: false
  };

  if (filters.genre) params.with_genres = filters.genre;
  if (filters.year) params.primary_release_year = filters.year;
  if (filters.minRating) {
    params['vote_average.gte'] = filters.minRating;
    params['vote_count.gte'] = 50;
  }
  if (filters.language) params.with_original_language = filters.language;
  params.sort_by = filters.sortBy || 'popularity.desc';

  try {
    const data = await tmdbFetch('/discover/movie', params, {
      fallback: { results: fallback, total_results: fallback.length, total_pages: 1 }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: fallback, total_results: fallback.length, total_pages: 1 };
  } catch (error) {
    return { results: fallback, total_results: fallback.length, total_pages: 1 };
  }
}

/**
 * Similar Movies
 */
export async function getSimilarMovies(movieId, page = 1) {
  try {
    const data = await tmdbFetch(`/movie/${movieId}/similar`, { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES.slice(0, 8) }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: CONFIG.DEMO_MOVIES.slice(0, 8) };
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES.slice(0, 8) };
  }
}

/**
 * Recommended Movies
 */
export async function getRecommendations(movieId, page = 1) {
  try {
    const data = await tmdbFetch(`/movie/${movieId}/recommendations`, { page }, {
      fallback: { results: CONFIG.DEMO_MOVIES.slice(2, 10) }
    });
    return (data && Array.isArray(data.results) && data.results.length > 0)
      ? data
      : { results: CONFIG.DEMO_MOVIES.slice(2, 10) };
  } catch (error) {
    return { results: CONFIG.DEMO_MOVIES.slice(2, 10) };
  }
}

/**
 * Movies By Genre
 */
export async function getMoviesByGenre(genreId, page = 1) {
  return discoverMovies({ genre: genreId, page, sortBy: 'popularity.desc' });
}
