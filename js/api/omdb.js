/**
 * OMDb API Integration Module
 * Fetches IMDb Ratings, Rotten Tomatoes Scores, Metascore, Box Office, and Awards
 * Uses user-configured API key (1f6bb1be)
 */

import { CONFIG } from '../config.js';

const omdbCache = new Map();

/**
 * Fetch movie details from OMDb by Title and Year or IMDb ID
 * @param {Object} params - { title, year, imdbId }
 * @returns {Promise<Object|null>}
 */
export async function getOmdbMovieDetails({ title, year, imdbId } = {}) {
  const cacheKey = imdbId || `${title}_${year || ''}`.toLowerCase().trim();
  if (omdbCache.has(cacheKey)) {
    return omdbCache.get(cacheKey);
  }

  const apiKey = CONFIG.OMDB_API_KEY || '1f6bb1be';
  let url = `${CONFIG.OMDB_BASE_URL}?apikey=${apiKey}&plot=full`;

  if (imdbId) {
    url += `&i=${encodeURIComponent(imdbId)}`;
  } else if (title) {
    url += `&t=${encodeURIComponent(title)}`;
    if (year) {
      url += `&y=${encodeURIComponent(year)}`;
    }
  } else {
    return null;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OMDb HTTP error: ${res.status}`);
    const data = await res.json();

    if (data.Response === 'True') {
      const result = {
        title: data.Title,
        year: data.Year,
        rated: data.Rated,
        released: data.Released,
        runtime: data.Runtime,
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        poster: data.Poster !== 'N/A' ? data.Poster : null,
        ratings: data.Ratings || [],
        imdbRating: data.imdbRating !== 'N/A' ? data.imdbRating : null,
        imdbVotes: data.imdbVotes !== 'N/A' ? data.imdbVotes : null,
        imdbID: data.imdbID,
        boxOffice: data.BoxOffice !== 'N/A' ? data.BoxOffice : null,
        metascore: data.Metascore !== 'N/A' ? data.Metascore : null,
        rottenTomatoes: (data.Ratings || []).find(r => r.Source === 'Rotten Tomatoes')?.Value || null
      };

      omdbCache.set(cacheKey, result);
      return result;
    }
    return null;
  } catch (err) {
    console.warn('OMDb API request failed:', err);
    return null;
  }
}

/**
 * Search movies on OMDb
 * @param {string} query
 * @param {number} page
 * @returns {Promise<Array>}
 */
export async function searchOmdbMovies(query, page = 1) {
  if (!query || !query.trim()) return [];
  const apiKey = CONFIG.OMDB_API_KEY || '1f6bb1be';
  const url = `${CONFIG.OMDB_BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(query.trim())}&page=${page}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.Response === 'True') {
      return data.Search || [];
    }
    return [];
  } catch (err) {
    console.warn('OMDb search error:', err);
    return [];
  }
}
