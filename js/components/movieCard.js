/**
 * Reusable Movie Card Component
 */

import { CONFIG } from '../config.js';
import { formatGenreNames } from '../api/genres.js';
import { favoriteService } from '../services/favoriteService.js';
import { watchlistService } from '../services/watchlistService.js';
import { formatRating, formatYear } from '../utils/formatters.js';
import { getImageUrl } from '../utils/helpers.js';
import { toast } from './toast.js';

export function createMovieCard(movie, options = {}) {
  if (!movie || !movie.id) return null;

  const { onRemove = null } = options;

  const isFav = favoriteService.isFavorite(movie.id);
  const isWatch = watchlistService.isInWatchlist(movie.id);

  const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_MEDIUM);
  const title = movie.title || movie.name || 'Untitled';
  const year = formatYear(movie.release_date || movie.first_air_date);
  const rating = formatRating(movie.vote_average);

  const card = document.createElement('article');
  card.className = 'movie-card';
  card.setAttribute('data-movie-id', movie.id);
  card.setAttribute('role', 'article');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${title} (${year}), Rating: ${rating}`);

  card.innerHTML = `
    <div class="movie-card-poster-wrap">
      <img
        src="${posterUrl}"
        alt="${title} Poster"
        class="movie-card-poster"
        loading="lazy"
        onerror="this.onerror=null;this.src='${CONFIG.FALLBACK_POSTER}'"
      />
      <div class="movie-card-overlay"></div>
      
      <div class="movie-card-top-badges">
        <span class="rating-pill" title="TMDB Rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          ${rating}
        </span>
        <span class="movie-card-year">${year}</span>
      </div>

      <div class="movie-card-actions">
        <button 
          type="button"
          class="card-action-btn watchlist-btn ${isWatch ? 'active' : ''}" 
          title="${isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}"
          aria-label="${isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWatch ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        <button 
          type="button"
          class="card-action-btn favorite-btn ${isFav ? 'active' : ''}" 
          title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}"
          aria-label="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="movie-card-info">
      <h3 class="movie-card-title" title="${title}">${title}</h3>
      <p class="movie-card-genres">Loading genre...</p>
    </div>
  `;

  // Fallback image handling
  const imgEl = card.querySelector('.movie-card-poster');
  imgEl.addEventListener('error', () => {
    imgEl.src = CONFIG.FALLBACK_POSTER;
  });

  // Async populate genres
  const genreIds = movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []);
  formatGenreNames(genreIds, 2).then(formatted => {
    const genreEl = card.querySelector('.movie-card-genres');
    if (genreEl) genreEl.textContent = formatted;
  });

  // Navigate to details on card click (excluding action buttons)
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-action-btn')) return;
    window.location.href = `movie.html?id=${movie.id}`;
  });

  // Accessibility keyboard navigation (Enter key)
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.target.closest('.card-action-btn')) {
      window.location.href = `movie.html?id=${movie.id}`;
    }
  });

  // Watchlist Toggle
  const watchBtn = card.querySelector('.watchlist-btn');
  watchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const added = watchlistService.toggleWatchlist(movie);
    watchBtn.classList.toggle('active', added);
    watchBtn.setAttribute('title', added ? 'Remove from Watchlist' : 'Add to Watchlist');
    watchBtn.setAttribute('aria-label', added ? 'Remove from Watchlist' : 'Add to Watchlist');
    const svg = watchBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Watchlist`);
    } else {
      toast.info(`"${title}" removed from Watchlist`);
      if (onRemove && options.source === 'watchlist') {
        onRemove(movie.id, card);
      }
    }
  });

  // Favorite Toggle
  const favBtn = card.querySelector('.favorite-btn');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const added = favoriteService.toggleFavorite(movie);
    favBtn.classList.toggle('active', added);
    favBtn.setAttribute('title', added ? 'Remove from Favorites' : 'Add to Favorites');
    favBtn.setAttribute('aria-label', added ? 'Remove from Favorites' : 'Add to Favorites');
    const svg = favBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Favorites`);
    } else {
      toast.info(`"${title}" removed from Favorites`);
      if (onRemove && options.source === 'favorites') {
        onRemove(movie.id, card);
      }
    }
  });

  return card;
}
