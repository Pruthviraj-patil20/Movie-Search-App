/**
 * Cinematic Hero Banner Component
 */

import { CONFIG } from '../config.js';
import { formatGenreNames } from '../api/genres.js';
import { watchlistService } from '../services/watchlistService.js';
import { formatRating, formatYear } from '../utils/formatters.js';
import { getBackdropUrl, getImageUrl } from '../utils/helpers.js';
import { modal } from './modal.js';
import { toast } from './toast.js';

export function renderHeroBanner(container, movie) {
  if (!container || !movie) return;

  const backdropUrl = getBackdropUrl(movie.backdrop_path, CONFIG.IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_LARGE);
  const title = movie.title || movie.name || 'Featured Movie';
  const year = formatYear(movie.release_date || movie.first_air_date);
  const rating = formatRating(movie.vote_average);
  const isWatch = watchlistService.isInWatchlist(movie.id);

  container.innerHTML = `
    <div class="hero-section">
      <div class="hero-backdrop" style="background-image: url('${backdropUrl}');"></div>
      <div class="hero-overlay"></div>

      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge-group">
            <span class="hero-featured-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Featured Spotlight
            </span>
            <span class="rating-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              ${rating}
            </span>
          </div>

          <h1 class="hero-title">${title}</h1>

          <div class="hero-meta-row">
            <span class="hero-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              ${year}
            </span>
            <span class="hero-dot-separator"></span>
            <span class="hero-meta-item hero-genres-text">Loading genre...</span>
          </div>

          <p class="hero-overview">${movie.overview || 'Experience this cinematic masterpiece on CineSphere.'}</p>

          <div class="hero-actions">
            <button type="button" class="btn btn-primary btn-watch-movie hero-watch-movie-btn" id="hero-watch-movie">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Movie
            </button>

            <button type="button" class="btn btn-secondary hero-trailer-btn" id="hero-play-trailer">
              <svg class="play-icon-pulse" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Trailer
            </button>

            <a href="movie.html?id=${movie.id}" class="btn btn-glass">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              View Details
            </a>

            <button type="button" class="btn btn-secondary hero-watchlist-btn ${isWatch ? 'active' : ''}" id="hero-watchlist-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWatch ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="hero-watchlist-label">${isWatch ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>
        </div>

        <div class="hero-poster-preview">
          <div class="hero-poster-card">
            <img src="${posterUrl}" alt="${title} Poster" class="hero-poster-img" />
          </div>
        </div>
      </div>
    </div>
  `;

  // Populate genres
  const genreIds = movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []);
  formatGenreNames(genreIds, 3).then(genres => {
    const genreEl = container.querySelector('.hero-genres-text');
    if (genreEl) genreEl.textContent = genres;
  });

  // Watch Movie Button Click
  const watchMovieBtn = container.querySelector('#hero-watch-movie');
  if (watchMovieBtn) {
    watchMovieBtn.addEventListener('click', () => {
      modal.openWatchMovie(movie.id, title, movie);
    });
  }

  // Watch Trailer Button Click
  const trailerBtn = container.querySelector('#hero-play-trailer');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      modal.openTrailer(movie.id, title);
    });
  }

  // Watchlist Button Click
  const watchBtn = container.querySelector('#hero-watchlist-btn');
  if (watchBtn) {
    watchBtn.addEventListener('click', () => {
      const added = watchlistService.toggleWatchlist(movie);
      watchBtn.classList.toggle('active', added);
      const label = watchBtn.querySelector('.hero-watchlist-label');
      if (label) label.textContent = added ? 'In Watchlist' : 'Add to Watchlist';
      const svg = watchBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');

      if (added) {
        toast.success(`"${title}" added to Watchlist`);
      } else {
        toast.info(`"${title}" removed from Watchlist`);
      }
    });
  }
}
