/**
 * TMDB Video & Trailer API Module
 */

import { tmdbFetch } from './tmdb.js';

/**
 * Fetch all video clips for a movie
 */
export async function getMovieVideos(movieId) {
  if (!movieId) return [];
  try {
    const data = await tmdbFetch(`/movie/${movieId}/videos`, {}, {
      fallback: { results: [] }
    });
    return data.results || [];
  } catch (error) {
    return [];
  }
}

/**
 * Find best YouTube trailer key for a movie
 */
export async function getMovieTrailer(movieId) {
  const videos = await getMovieVideos(movieId);
  if (!videos || videos.length === 0) return null;

  // Filter for YouTube videos
  const youtubeVideos = videos.filter(v => v.site === 'YouTube');

  // Priority 1: Official Trailer
  const officialTrailer = youtubeVideos.find(
    v => v.type === 'Trailer' && v.official === true
  );
  if (officialTrailer) return officialTrailer;

  // Priority 2: Any Trailer
  const anyTrailer = youtubeVideos.find(v => v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  // Priority 3: Teaser
  const teaser = youtubeVideos.find(v => v.type === 'Teaser');
  if (teaser) return teaser;

  // Priority 4: Clip or Featurette
  return youtubeVideos[0] || null;
}
