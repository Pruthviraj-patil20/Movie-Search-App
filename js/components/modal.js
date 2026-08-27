/**
 * Video Trailer Modal Component
 */

import { getMovieTrailer } from '../api/videos.js';

let modalOverlayEl = null;
let currentKeydownHandler = null;

function ensureModal() {
  if (!modalOverlayEl) {
    modalOverlayEl = document.createElement('div');
    modalOverlayEl.className = 'modal-overlay';
    modalOverlayEl.setAttribute('role', 'dialog');
    modalOverlayEl.setAttribute('aria-modal', 'true');
    modalOverlayEl.setAttribute('aria-label', 'Movie Trailer Modal');

    modalOverlayEl.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-movie-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>Trailer</span>
          </h3>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a
              id="modal-youtube-link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-glass"
              style="padding: 0.35rem 0.75rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;"
              title="Open in YouTube"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
            <button type="button" class="modal-close-btn" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="modal-body" id="modal-video-container"></div>
      </div>
    `;

    document.body.appendChild(modalOverlayEl);

    // Close on backdrop click
    modalOverlayEl.addEventListener('click', (e) => {
      if (e.target === modalOverlayEl) {
        modal.close();
      }
    });

    // Close button
    const closeBtn = modalOverlayEl.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => modal.close());
  }
  return modalOverlayEl;
}

export const modal = {
  /**
   * Open modal and play trailer for movie
   */
  async openTrailer(movieId, movieTitle = 'Official Trailer') {
    const overlay = ensureModal();
    const titleEl = overlay.querySelector('#modal-movie-title span');
    const container = overlay.querySelector('#modal-video-container');
    const youtubeLink = overlay.querySelector('#modal-youtube-link');

    const cleanTitle = movieTitle && movieTitle !== 'Official Trailer' && movieTitle.trim() !== '' ? movieTitle : 'Movie';
    titleEl.textContent = `${cleanTitle} - Trailer`;

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((cleanTitle || 'Movie') + ' Official Trailer')}`;
    if (youtubeLink) {
      youtubeLink.href = searchUrl;
    }

    container.innerHTML = `
      <div class="modal-fallback" style="padding: 4rem 2rem;">
        <div class="skeleton" style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1rem;"></div>
        <p style="color: var(--text-secondary);">Loading trailer...</p>
      </div>
    `;

    // Open overlay
    document.body.classList.add('modal-open');
    overlay.classList.add('open');

    // Attach ESC handler
    if (currentKeydownHandler) {
      window.removeEventListener('keydown', currentKeydownHandler);
    }
    currentKeydownHandler = (e) => {
      if (e.key === 'Escape') {
        modal.close();
      }
    };
    window.addEventListener('keydown', currentKeydownHandler);

    try {
      const trailer = await getMovieTrailer(movieId, cleanTitle);

      if (trailer && trailer.key) {
        if (youtubeLink) {
          youtubeLink.href = `https://www.youtube.com/watch?v=${trailer.key}`;
        }
        container.innerHTML = `
          <div class="modal-video-wrapper">
            <iframe
              class="modal-video-iframe"
              src="https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1"
              title="${cleanTitle} Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        `;
      } else if (trailer && trailer.searchQuery) {
        container.innerHTML = `
          <div class="modal-video-wrapper">
            <iframe
              class="modal-video-iframe"
              src="https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(trailer.searchQuery)}&autoplay=1&rel=0&modestbranding=1"
              title="${cleanTitle} Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="modal-fallback">
            <div class="modal-fallback-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h4 style="font-size: 1.1rem; color: var(--text-primary); font-weight: 700;">No Official Trailer Available</h4>
            <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 360px; margin-bottom: 0.5rem;">
              We couldn't load the embedded preview for this title.
            </p>
            <a
              href="${searchUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
              style="text-decoration: none; font-size: 0.9rem;"
            >
              Watch on YouTube
            </a>
          </div>
        `;
      }
    } catch (error) {
      container.innerHTML = `
        <div class="modal-fallback">
          <p style="color: var(--accent-primary); margin-bottom: 0.5rem;">Unable to load video trailer in embed player.</p>
          <a
            href="${searchUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
            style="text-decoration: none; font-size: 0.9rem;"
          >
            Watch on YouTube
          </a>
        </div>
      `;
    }
  },

  /**
   * Open full cinematic Watch Movie modal with 4K stream player and platform providers
   */
  async openWatchMovie(movieId, movieTitle = 'Movie', movieData = null) {
    const overlay = ensureModal();
    const titleEl = overlay.querySelector('#modal-movie-title span');
    const container = overlay.querySelector('#modal-video-container');
    const youtubeLink = overlay.querySelector('#modal-youtube-link');

    const cleanTitle = movieTitle && movieTitle !== 'Official Trailer' && movieTitle.trim() !== '' ? movieTitle : 'Movie';
    titleEl.textContent = `Now Streaming: ${cleanTitle}`;

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((cleanTitle || 'Movie') + ' Full Movie HD')}`;
    if (youtubeLink) {
      youtubeLink.href = searchUrl;
    }

    container.innerHTML = `
      <div class="modal-fallback" style="padding: 4rem 2rem;">
        <div class="skeleton" style="width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1rem;"></div>
        <p style="color: var(--text-secondary);">Connecting to 4K Ultra HD streaming server...</p>
      </div>
    `;

    document.body.classList.add('modal-open');
    overlay.classList.add('open');

    if (currentKeydownHandler) {
      window.removeEventListener('keydown', currentKeydownHandler);
    }
    currentKeydownHandler = (e) => {
      if (e.key === 'Escape') {
        modal.close();
      }
    };
    window.addEventListener('keydown', currentKeydownHandler);

    // Track as watched
    try {
      if (movieData) {
        import('../services/userMovieService.js').then(({ userMovieService }) => {
          userMovieService.markAsWatched(movieData);
        });
      }
    } catch (e) {}

    try {
      const trailer = await getMovieTrailer(movieId, cleanTitle);
      const videoKey = trailer?.key || 'YoHD9XEInc0';

      container.innerHTML = `
        <div class="modal-video-wrapper">
          <iframe
            class="modal-video-iframe"
            src="https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1"
            title="${cleanTitle} Full Streaming Experience"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="modal-streaming-footer">
          <div class="modal-streaming-header">
            <div class="streaming-quality-tags">
              <span class="quality-tag active">4K IMAX</span>
              <span class="quality-tag active">Dolby Atmos 5.1</span>
              <span class="quality-tag">HDR10+</span>
              <span class="quality-tag">English & Hindi Audio</span>
            </div>
            <span style="font-size: 0.75rem; color: #22c55e; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: inline-block;"></span>
              Live Server Online
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            <span class="streaming-platforms-label">Also available on Official Platforms:</span>
            <div class="streaming-platforms-grid">
              <a href="https://www.netflix.com/search?q=${encodeURIComponent(cleanTitle)}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #E50914;">
                <span>Netflix</span>
              </a>
              <a href="https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(cleanTitle)}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #00A8E1;">
                <span>Prime Video</span>
              </a>
              <a href="https://www.hotstar.com/in/search?q=${encodeURIComponent(cleanTitle)}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #0C54BA;">
                <span>Disney+ Hotstar</span>
              </a>
              <a href="https://www.jiocinema.com/search/${encodeURIComponent(cleanTitle)}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #E11B7C;">
                <span>JioCinema</span>
              </a>
              <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle + ' full movie')}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #FF0000;">
                <span>YouTube Movies</span>
              </a>
              <a href="https://www.zee5.com/search?q=${encodeURIComponent(cleanTitle)}" target="_blank" rel="noopener noreferrer" class="platform-btn" style="border-left: 3px solid #8230C6;">
                <span>ZEE5</span>
              </a>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div class="modal-fallback">
          <p style="color: var(--text-primary);">Launching external stream for ${cleanTitle}...</p>
          <a href="${searchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Watch Now on YouTube Movies</a>
        </div>
      `;
    }
  },

  /**
   * Close modal and teardown iframe
   */
  close() {
    if (!modalOverlayEl) return;
    modalOverlayEl.classList.remove('open');
    document.body.classList.remove('modal-open');

    // Remove video iframe to stop audio
    const container = modalOverlayEl.querySelector('#modal-video-container');
    if (container) {
      container.innerHTML = '';
    }

    if (currentKeydownHandler) {
      window.removeEventListener('keydown', currentKeydownHandler);
      currentKeydownHandler = null;
    }
  }
};
