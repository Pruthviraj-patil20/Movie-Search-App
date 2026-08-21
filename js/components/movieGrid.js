/**
 * Movie Grid Component
 */

import { createMovieCard } from './movieCard.js';

export function renderMovieGrid(container, movies = [], options = {}) {
  if (!container) return;

  container.innerHTML = '';

  if (!movies || movies.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();

  movies.forEach(movie => {
    const card = createMovieCard(movie, options);
    if (card) {
      fragment.appendChild(card);
    }
  });

  container.appendChild(fragment);
}
