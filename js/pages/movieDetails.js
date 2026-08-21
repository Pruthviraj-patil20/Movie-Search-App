/**
 * Movie Details Page Controller
 */

import { CONFIG } from '../config.js';
import { getMovieDetails, getRecommendations, getSimilarMovies } from '../api/movies.js';
import { createMovieCarousel } from '../components/carousel.js';
import { loader } from '../components/loader.js';
import { modal } from '../components/modal.js';
import { skeleton } from '../components/skeleton.js';
import { toast } from '../components/toast.js';
import { favoriteService, FAVORITES_EVENT } from '../services/favoriteService.js';
import { watchlistService, WATCHLIST_EVENT } from '../services/watchlistService.js';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRating,
  formatRuntime,
  formatYear
} from '../utils/formatters.js';
import { getBackdropUrl, getImageUrl, onEvent } from '../utils/helpers.js';
import { getUrlParam } from '../utils/urlParams.js';
import { isValidMovieId } from '../utils/validators.js';

export async function initMovieDetailsPage() {
  const mountEl = document.querySelector('#movie-details-mount');
  const castMount = document.querySelector('#cast-slider-mount');
  const similarMount = document.querySelector('#similar-carousel-mount');
  const recsMount = document.querySelector('#recommendations-carousel-mount');

  const movieId = getUrlParam('id');

  if (!isValidMovieId(movieId)) {
    window.location.href = '404.html';
    return;
  }

  if (mountEl) mountEl.innerHTML = skeleton.details();
  loader.start();

  try {
    const movie = await getMovieDetails(movieId);

    if (!movie || !movie.id) {
      window.location.href = '404.html';
      return;
    }

    // Set Document Title
    document.title = `${movie.title} (${formatYear(movie.release_date)}) - CineSphere`;

    // 1. Render Main Showcase Details
    renderShowcase(mountEl, movie);

    // 2. Render Cast Members Slider
    if (castMount && movie.credits && movie.credits.cast) {
      renderCast(castMount, movie.credits.cast.slice(0, 15));
    }

    // 3. Render Similar Movies Carousel
    if (similarMount) {
      const similarData = await getSimilarMovies(movie.id);
      const similarMovies = similarData.results || [];
      if (similarMovies.length > 0) {
        similarMount.innerHTML = '';
        similarMount.appendChild(
          createMovieCarousel(similarMovies.slice(0, 16), { title: 'Similar Movies' })
        );
      } else {
        const sec = document.querySelector('#similar-section');
        if (sec) sec.style.display = 'none';
      }
    }

    // 4. Render Recommended Movies Carousel
    if (recsMount) {
      const recsData = await getRecommendations(movie.id);
      const recMovies = recsData.results || [];
      if (recMovies.length > 0) {
        recsMount.innerHTML = '';
        recsMount.appendChild(
          createMovieCarousel(recMovies.slice(0, 16), { title: 'Recommended Movies' })
        );
      } else {
        const sec = document.querySelector('#recommendations-section');
        if (sec) sec.style.display = 'none';
      }
    }

  } catch (error) {
    console.error('[MovieDetailsPage] Error rendering movie details:', error);
    if (mountEl) {
      mountEl.innerHTML = `
        <div class="container section" style="padding-top: 5rem; text-align: center;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Failed to load movie details</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Please check your connection or return to home.</p>
          <a href="index.html" class="btn btn-primary">Back to Home</a>
        </div>
      `;
    }
  } finally {
    loader.done();
  }
}

function renderShowcase(container, movie) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, CONFIG.IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_LARGE);
  const title = movie.title || 'Untitled';
  const year = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const votes = formatNumber(movie.vote_count);
  const runtime = formatRuntime(movie.runtime);
  const releaseDate = formatDate(movie.release_date);
  const budget = formatCurrency(movie.budget);
  const revenue = formatCurrency(movie.revenue);
  const status = movie.status || 'Released';
  const originalLanguage = (movie.original_language || 'en').toUpperCase();
  const companies = (movie.production_companies || []).map(c => c.name).join(', ') || 'Independent';

  const isWatch = watchlistService.isInWatchlist(movie.id);
  const isFav = favoriteService.isFavorite(movie.id);

  // Genre pills HTML
  const genresHtml = (movie.genres || [])
    .map(g => `<a href="search.html?genre=${g.id}" class="genre-tag">${g.name}</a>`)
    .join('');

  container.innerHTML = `
    <div class="movie-details-hero">
      <div class="details-backdrop" style="background-image: url('${backdropUrl}');"></div>
      <div class="details-overlay"></div>

      <div class="details-container">
        <!-- Left: Poster -->
        <div class="details-poster-wrap">
          <img src="${posterUrl}" alt="${title} Poster" class="details-poster-img" />
        </div>

        <!-- Right: Info -->
        <div class="details-info">
          <nav class="details-breadcrumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <span>/</span>
            <a href="search.html">Movies</a>
            <span>/</span>
            <span style="color: var(--text-primary);">${title}</span>
          </nav>

          <div class="details-title-wrap">
            <h1 class="details-title">${title}</h1>
            ${movie.tagline ? `<p class="details-tagline">“${movie.tagline}”</p>` : ''}
          </div>

          <div class="details-metrics-row">
            <div class="metric-item metric-star-score" title="TMDB Rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <strong>${rating}</strong>
              <span style="color: var(--text-muted); font-size: 0.8rem;">(${votes} votes)</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${runtime}</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${releaseDate}</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <span class="badge badge-outline">${status}</span>
            </div>
          </div>

          <div class="details-genres">
            ${genresHtml}
          </div>

          <div class="details-actions-bar">
            <button type="button" class="btn btn-primary" id="details-play-trailer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Trailer
            </button>

            <button type="button" class="btn btn-secondary ${isWatch ? 'active' : ''}" id="details-watchlist-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWatch ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span id="details-watchlist-label">${isWatch ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button type="button" class="btn btn-secondary ${isFav ? 'active' : ''}" id="details-favorite-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span id="details-fav-label">${isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button type="button" class="btn btn-glass btn-icon" id="details-share-btn" title="Share Movie" aria-label="Share movie link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>

          <div class="details-overview-section">
            <h3 class="details-section-heading">Overview</h3>
            <p class="details-overview-text">${movie.overview || 'No overview has been provided for this title.'}</p>
          </div>

          <div class="details-meta-grid">
            <div class="meta-block">
              <span class="meta-label">Original Language</span>
              <span class="meta-value">${originalLanguage}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Budget</span>
              <span class="meta-value">${budget}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Box Office</span>
              <span class="meta-value">${revenue}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Production</span>
              <span class="meta-value" title="${companies}">${companies}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const trailerBtn = container.querySelector('#details-play-trailer');
  trailerBtn.addEventListener('click', () => {
    modal.openTrailer(movie.id, title);
  });

  // Watchlist Toggle
  const watchBtn = container.querySelector('#details-watchlist-btn');
  const watchLabel = container.querySelector('#details-watchlist-label');
  watchBtn.addEventListener('click', () => {
    const added = watchlistService.toggleWatchlist(movie);
    watchBtn.classList.toggle('active', added);
    watchLabel.textContent = added ? 'In Watchlist' : 'Add to Watchlist';
    const svg = watchBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Watchlist`);
    } else {
      toast.info(`"${title}" removed from Watchlist`);
    }
  });

  // Favorite Toggle
  const favBtn = container.querySelector('#details-favorite-btn');
  const favLabel = container.querySelector('#details-fav-label');
  favBtn.addEventListener('click', () => {
    const added = favoriteService.toggleFavorite(movie);
    favBtn.classList.toggle('active', added);
    favLabel.textContent = added ? 'Favorited' : 'Favorite';
    const svg = favBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Favorites`);
    } else {
      toast.info(`"${title}" removed from Favorites`);
    }
  });

  // Share Button
  const shareBtn = container.querySelector('#details-share-btn');
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: `${title} - CineSphere`,
      text: `Check out ${title} on CineSphere!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Movie link copied to clipboard!');
    } catch (err) {
      toast.info('Could not copy link.');
    }
  });
}

function renderCast(container, castList) {
  if (!castList || castList.length === 0) {
    const sec = document.querySelector('#cast-section');
    if (sec) sec.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  const slider = document.createElement('div');
  slider.className = 'cast-slider';

  castList.forEach(member => {
    const photoUrl = member.profile_path
      ? `${CONFIG.IMAGE_BASE_URL}${CONFIG.IMAGE_SIZES.PROFILE_MEDIUM}${member.profile_path}`
      : CONFIG.FALLBACK_AVATAR;

    const card = document.createElement('div');
    card.className = 'cast-card';
    card.innerHTML = `
      <div class="cast-photo-wrap">
        <img src="${photoUrl}" alt="${member.name}" class="cast-photo" loading="lazy" />
      </div>
      <span class="cast-name">${member.name}</span>
      <span class="cast-character">${member.character || 'Cast'}</span>
    `;

    const img = card.querySelector('.cast-photo');
    img.addEventListener('error', () => {
      img.src = CONFIG.FALLBACK_AVATAR;
    });

    slider.appendChild(card);
  });

  container.appendChild(slider);
}
