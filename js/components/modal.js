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
          <button type="button" class="modal-close-btn" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
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

    titleEl.textContent = `${movieTitle} - Trailer`;
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
      const trailer = await getMovieTrailer(movieId);

      if (trailer && trailer.key) {
        container.innerHTML = `
          <div class="modal-video-wrapper">
            <iframe
              class="modal-video-iframe"
              src="https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1"
              title="${movieTitle} Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 360px;">
              A preview video hasn't been uploaded by the studio for this title yet.
            </p>
          </div>
        `;
      }
    } catch (error) {
      container.innerHTML = `
        <div class="modal-fallback">
          <p style="color: var(--accent-primary);">Unable to load video trailer. Please try again later.</p>
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
