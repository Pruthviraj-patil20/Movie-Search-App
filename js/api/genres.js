/**
 * TMDB Genres API Module
 */

import { tmdbFetch } from './tmdb.js';

// Pre-populated default genres in case of network issues
const DEFAULT_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

let genresMapCache = null;

/**
 * Fetch list of official TMDB movie genres
 */
export async function getMovieGenres() {
  try {
    const data = await tmdbFetch('/genre/movie/list', {}, {
      cacheTtlMs: 1000 * 60 * 60 * 24, // 24hr cache
      fallback: { genres: DEFAULT_GENRES }
    });
    return data.genres || DEFAULT_GENRES;
  } catch (error) {
    return DEFAULT_GENRES;
  }
}

/**
 * Get map of genre ID to genre name
 */
export async function getGenreMap() {
  if (genresMapCache) return genresMapCache;
  const genres = await getMovieGenres();
  genresMapCache = new Map(genres.map(g => [g.id, g.name]));
  return genresMapCache;
}

/**
 * Format an array of genre IDs into human-readable string (e.g. "Action, Sci-Fi")
 */
export async function formatGenreNames(genreIds = [], limit = 3) {
  if (!genreIds || genreIds.length === 0) return 'Cinema';
  const map = await getGenreMap();
  const names = genreIds
    .map(id => map.get(id))
    .filter(Boolean)
    .slice(0, limit);
  return names.length ? names.join(' • ') : 'Cinema';
}
