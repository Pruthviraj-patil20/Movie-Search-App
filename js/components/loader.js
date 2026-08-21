/**
 * Top Page Progress Loader Bar Component
 */

let progressBarEl = null;

export const loader = {
  /**
   * Initialize progress bar element
   */
  init() {
    if (!progressBarEl) {
      progressBarEl = document.createElement('div');
      progressBarEl.className = 'page-progress-bar';
      document.body.appendChild(progressBarEl);
    }
  },

  /**
   * Start progress simulation
   */
  start() {
    this.init();
    progressBarEl.classList.remove('done');
    progressBarEl.classList.add('active');
    progressBarEl.style.width = '30%';

    setTimeout(() => {
      if (progressBarEl.classList.contains('active')) {
        progressBarEl.style.width = '70%';
      }
    }, 200);
  },

  /**
   * Complete progress and fade out
   */
  done() {
    if (!progressBarEl) return;
    progressBarEl.style.width = '100%';
    progressBarEl.classList.add('done');

    setTimeout(() => {
      progressBarEl.classList.remove('active', 'done');
      progressBarEl.style.width = '0%';
    }, 400);
  }
};
