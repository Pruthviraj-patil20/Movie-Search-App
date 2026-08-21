/**
 * Interactive 1-10 Movie Rating Modal
 */

import { userMovieService } from '../services/userMovieService.js';
import { toast } from './toast.js';

let ratingModalEl = null;

function ensureRatingModal() {
  if (!ratingModalEl) {
    ratingModalEl = document.createElement('div');
    ratingModalEl.className = 'modal-overlay';
    ratingModalEl.id = 'movie-rating-modal';
    ratingModalEl.setAttribute('role', 'dialog');
    ratingModalEl.setAttribute('aria-modal', 'true');
    ratingModalEl.setAttribute('aria-label', 'Rate Movie');

    ratingModalEl.innerHTML = `
      <div class="modal-dialog" style="max-width: 480px;">
        <div class="modal-header">
          <h3 class="modal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color: var(--accent-gold);">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span id="rating-modal-movie-title">Rate Movie</span>
          </h3>
          <button type="button" class="modal-close-btn" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" style="padding: var(--space-6); text-align: center;">
          <div id="rating-score-display" style="font-size: 2.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--accent-gold); margin-bottom: var(--space-3);">
            -- / 10
          </div>
          <p id="rating-score-desc" style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-5);">
            Select a score from 1 to 10
          </p>

          <!-- 10 Star Rating Selector -->
          <div id="rating-stars-container" style="display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: var(--space-6);">
            ${Array.from({ length: 10 }, (_, i) => i + 1).map(num => `
              <button type="button" class="rating-star-btn" data-score="${num}" aria-label="Rate ${num} out of 10" style="width: 34px; height: 34px; border-radius: var(--radius-sm); background: var(--bg-tertiary); border: 1px solid var(--border-subtle); color: var(--text-muted); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); cursor: pointer;">
                ${num}
              </button>
            `).join('')}
          </div>

          <div style="display: flex; gap: var(--space-3); justify-content: center;">
            <button type="button" id="rating-clear-btn" class="btn btn-outline btn-sm" style="display: none;">Remove Rating</button>
            <button type="button" id="rating-submit-btn" class="btn btn-primary" disabled>Submit Rating</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(ratingModalEl);

    // Close handlers
    ratingModalEl.addEventListener('click', (e) => {
      if (e.target === ratingModalEl) ratingModal.close();
    });
    ratingModalEl.querySelector('.modal-close-btn').addEventListener('click', () => ratingModal.close());
  }
  return ratingModalEl;
}

export const ratingModal = {
  currentMovie: null,
  selectedScore: null,
  existingScore: null,

  async open(movie) {
    if (!movie || !movie.id) return;
    this.currentMovie = movie;

    const overlay = ensureRatingModal();
    const titleEl = overlay.querySelector('#rating-modal-movie-title');
    const displayEl = overlay.querySelector('#rating-score-display');
    const descEl = overlay.querySelector('#rating-score-desc');
    const submitBtn = overlay.querySelector('#rating-submit-btn');
    const clearBtn = overlay.querySelector('#rating-clear-btn');
    const starBtns = overlay.querySelectorAll('.rating-star-btn');

    titleEl.textContent = `Rate "${movie.title || 'Movie'}"`;

    // Fetch existing rating
    const currentRating = await userMovieService.getMovieRating(movie.id);
    this.existingScore = currentRating;
    this.selectedScore = currentRating;

    const updateUI = (score) => {
      if (score) {
        displayEl.textContent = `${score} / 10`;
        displayEl.style.color = 'var(--accent-gold)';
        submitBtn.disabled = false;
        if (score >= 9) descEl.textContent = '🌟 Masterpiece!';
        else if (score >= 7) descEl.textContent = '👍 Great Movie';
        else if (score >= 5) descEl.textContent = '👌 Average';
        else descEl.textContent = '👎 Poor';
      } else {
        displayEl.textContent = '-- / 10';
        displayEl.style.color = 'var(--text-muted)';
        descEl.textContent = 'Select a score from 1 to 10';
        submitBtn.disabled = true;
      }

      starBtns.forEach(btn => {
        const val = Number(btn.getAttribute('data-score'));
        if (score && val <= score) {
          btn.style.background = 'var(--accent-primary)';
          btn.style.color = '#FFFFFF';
          btn.style.borderColor = 'var(--accent-primary)';
        } else {
          btn.style.background = 'var(--bg-tertiary)';
          btn.style.color = 'var(--text-muted)';
          btn.style.borderColor = 'var(--border-subtle)';
        }
      });
    };

    updateUI(this.selectedScore);

    if (this.existingScore) {
      clearBtn.style.display = 'inline-flex';
    } else {
      clearBtn.style.display = 'none';
    }

    // Star hover & click
    starBtns.forEach(btn => {
      const val = Number(btn.getAttribute('data-score'));
      btn.onmouseenter = () => updateUI(val);
      btn.onmouseleave = () => updateUI(this.selectedScore);
      btn.onclick = () => {
        this.selectedScore = val;
        updateUI(this.selectedScore);
      };
    });

    // Submit handler
    submitBtn.onclick = async () => {
      if (!this.selectedScore) return;
      await userMovieService.rateMovie(this.currentMovie.id, this.selectedScore, this.currentMovie);
      toast.success(`Rated "${this.currentMovie.title}" ${this.selectedScore}/10!`);
      this.close();
    };

    // Clear handler
    clearBtn.onclick = async () => {
      await userMovieService.removeRating(this.currentMovie.id);
      toast.info(`Rating removed for "${this.currentMovie.title}"`);
      this.close();
    };

    document.body.classList.add('modal-open');
    overlay.classList.add('open');
  },

  close() {
    if (!ratingModalEl) return;
    ratingModalEl.classList.remove('open');
    document.body.classList.remove('modal-open');
    this.currentMovie = null;
    this.selectedScore = null;
  }
};
