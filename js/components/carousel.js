/**
 * Horizontal Carousel Component
 * Provides smooth scrolling, prev/next arrow navigation, and touch/drag gestures
 */

import { createMovieCard } from './movieCard.js';

export function createMovieCarousel(movies = [], options = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const container = document.createElement('div');
  container.className = 'carousel-container';
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', options.title || 'Movie Carousel');

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous movies');
  prevBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn next';
  nextBtn.setAttribute('aria-label', 'Next movies');
  nextBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

  // Append movie items
  movies.forEach(movie => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    const card = createMovieCard(movie, options);
    if (card) {
      item.appendChild(card);
      container.appendChild(item);
    }
  });

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(container);
  wrapper.appendChild(nextBtn);

  // Scroll logic
  const scrollAmount = () => container.clientWidth * 0.75;

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  // Update button visibility
  const updateButtons = () => {
    const isAtStart = container.scrollLeft <= 10;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  };

  container.addEventListener('scroll', updateButtons, { passive: true });
  setTimeout(updateButtons, 100);

  return wrapper;
}
