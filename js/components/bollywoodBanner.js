/**
 * CineSphere Bollywood & Classics Spotlight Banner Component
 * Renders an interactive, cinematic movie showcase banner with real poster & backdrop artwork,
 * trailer playback, watchlist integration, and instant movie switcher pills.
 */

import { CONFIG } from '../config.js';
import { formatGenreNames } from '../api/genres.js';
import { modal } from './modal.js';
import { toast } from './toast.js';
import { watchlistService } from '../services/watchlistService.js';
import { formatRating, formatYear } from '../utils/formatters.js';
import { getBackdropUrl, getImageUrl } from '../utils/helpers.js';

export function renderBollywoodBanner(container, movies = [], options = {}) {
  if (!container || !movies || movies.length === 0) return;

  const {
    tagline = '🇮🇳 Bollywood & Classics Spotlight',
    autoplayInterval = 9000,
    onMovieChange = null
  } = options;

  let activeIndex = 0;
  let autoplayTimer = null;
  let isHovered = false;

  function render() {
    const movie = movies[activeIndex];
    if (!movie) return;

    const isWatch = watchlistService.isInWatchlist(movie.id);
    const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_LARGE);
    const backdropUrl = getBackdropUrl(movie.backdrop_path, CONFIG.IMAGE_SIZES.BACKDROP_ORIGINAL);
    const title = movie.title || movie.name || 'Featured Movie';
    const year = formatYear(movie.release_date || movie.year || movie.first_air_date);
    const rating = formatRating(movie.vote_average || 8.2);
    const overview = movie.overview || 'Experience one of the greatest masterpieces of Indian Cinema, celebrating timeless storytelling, unforgettable performances, and iconic music.';

    const genresList = (movie.genres || []).map(g => {
      const gName = typeof g === 'object' ? g.name : g;
      return `<span class="bollywood-banner-genre-pill">${gName}</span>`;
    }).join('');

    // Generate switcher pills for top curated classics
    const pillsHtml = movies.slice(0, 8).map((m, idx) => {
      const mTitle = m.title || m.name || 'Movie';
      const mYear = formatYear(m.release_date || m.year);
      const isActive = idx === activeIndex;
      return `
        <button 
          type="button" 
          class="bollywood-nav-pill ${isActive ? 'active' : ''}" 
          data-index="${idx}"
          aria-label="Switch banner to ${mTitle}"
        >
          <span class="bollywood-nav-pill-dot"></span>
          <span>${mTitle}</span>
          ${mYear ? `<span style="opacity: 0.65; font-size: 0.7rem;">(${mYear})</span>` : ''}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="bollywood-banner-wrapper" id="bollywood-spotlight-banner">
        <!-- Dynamic Backdrop -->
        <div class="bollywood-banner-backdrop" style="background-image: url('${backdropUrl}');"></div>
        <div class="bollywood-banner-overlay"></div>

        <!-- Main Banner Container -->
        <div class="bollywood-banner-container">
          <div class="bollywood-banner-content">
            <!-- Badges -->
            <div class="bollywood-banner-badge-group">
              <span class="bollywood-banner-tag">
                <span class="bollywood-pulse-dot"></span>
                ${tagline}
              </span>
              <span class="bollywood-banner-rating">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                ${rating} / 10
              </span>
              <span class="bollywood-banner-year">${year}</span>
              <span class="bollywood-banner-lang">Hindi • UHD</span>
            </div>

            <!-- Title -->
            <h3 class="bollywood-banner-title">${title}</h3>

            <!-- Genres -->
            <div class="bollywood-banner-genres" id="bollywood-banner-genres">
              ${genresList || '<span class="bollywood-banner-genre-pill">Action</span><span class="bollywood-banner-genre-pill">Drama</span>'}
            </div>

            <!-- Synopsis -->
            <p class="bollywood-banner-overview">${overview}</p>

            <!-- Action Buttons -->
            <div class="bollywood-banner-actions">
              <button type="button" class="btn btn-primary bollywood-btn-play" id="bollywood-banner-trailer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>Watch Trailer</span>
              </button>

              <a href="movie.html?id=${movie.id}" class="bollywood-btn-details" id="bollywood-banner-details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>View Details</span>
              </a>

              <button 
                type="button" 
                class="bollywood-btn-watchlist ${isWatch ? 'active' : ''}" 
                id="bollywood-banner-watchlist"
                title="${isWatch ? 'In Watchlist' : 'Add to Watchlist'}"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWatch ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="watchlist-text">${isWatch ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>

          <!-- Right Column: 3D Floating Poster -->
          <div class="bollywood-banner-poster-col">
            <div class="bollywood-banner-poster-card">
              <img 
                src="${posterUrl}" 
                alt="${title} Poster" 
                class="bollywood-banner-poster-img"
                onerror="this.onerror=null;this.src='${CONFIG.FALLBACK_POSTER}'"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Quick Switcher Pills -->
        <div class="bollywood-banner-nav">
          <span class="bollywood-banner-nav-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Spotlight:
          </span>
          ${pillsHtml}
        </div>
      </div>
    `;

    // Fetch genres if movie has genre_ids but no populated genres
    if (!genresList && movie.genre_ids && movie.genre_ids.length > 0) {
      formatGenreNames(movie.genre_ids, 3).then(formatted => {
        const genresEl = container.querySelector('#bollywood-banner-genres');
        if (genresEl && formatted) {
          genresEl.innerHTML = formatted.split(', ').map(g => `<span class="bollywood-banner-genre-pill">${g}</span>`).join('');
        }
      });
    }

    // Attach Event Handlers
    const bannerWrapper = container.querySelector('#bollywood-spotlight-banner');
    
    // Pause autoplay on mouse enter
    bannerWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    bannerWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Trailer Play
    const trailerBtn = container.querySelector('#bollywood-banner-trailer');
    if (trailerBtn) {
      trailerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.openTrailer(movie.id, `${movie.title} (${year})`);
      });
    }

    // Watchlist Toggle
    const watchBtn = container.querySelector('#bollywood-banner-watchlist');
    if (watchBtn) {
      watchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const added = watchlistService.toggleWatchlist(movie);
        watchBtn.classList.toggle('active', added);
        const svg = watchBtn.querySelector('svg');
        const text = watchBtn.querySelector('.watchlist-text');
        if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
        if (text) text.textContent = added ? 'In Watchlist' : 'Add to Watchlist';
        toast.show(
          added ? `Added "${movie.title}" to your Watchlist` : `Removed "${movie.title}" from Watchlist`,
          added ? 'success' : 'info'
        );
      });
    }

    // Switcher Pills Click Handlers
    const pills = container.querySelectorAll('.bollywood-nav-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const newIdx = parseInt(pill.getAttribute('data-index'), 10);
        if (!isNaN(newIdx) && newIdx !== activeIndex) {
          activeIndex = newIdx;
          render();
          if (typeof onMovieChange === 'function') {
            onMovieChange(movies[activeIndex]);
          }
        }
      });
    });
  }

  // Setup periodic autoplay rotation
  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    if (movies.length <= 1) return;

    autoplayTimer = setInterval(() => {
      if (!isHovered && document.body.contains(container)) {
        activeIndex = (activeIndex + 1) % Math.min(movies.length, 8);
        render();
      }
    }, autoplayInterval);
  }

  // Initial render
  render();
  startAutoplay();

  return {
    setActiveMovie(movieOrId) {
      let idx = -1;
      if (typeof movieOrId === 'object' && movieOrId !== null) {
        idx = movies.findIndex(m => m.id === movieOrId.id);
      } else {
        idx = movies.findIndex(m => m.id === movieOrId || String(m.id) === String(movieOrId));
      }
      if (idx !== -1) {
        activeIndex = idx;
        render();
      }
    },
    destroy() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
  };
}
