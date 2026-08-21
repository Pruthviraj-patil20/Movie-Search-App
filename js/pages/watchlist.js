/**
 * Watchlist Page Controller
 */

import { createEmptyState } from '../components/emptyState.js';
import { createMovieCard } from '../components/movieCard.js';
import { watchlistService } from '../services/watchlistService.js';
import { debounce } from '../utils/debounce.js';

export function initWatchlistPage() {
  const gridContainer = document.querySelector('#watchlist-grid');
  const countBadge = document.querySelector('#watchlist-header-count');
  const searchInput = document.querySelector('#watchlist-search');
  const sortSelect = document.querySelector('#watchlist-sort');
  const clearBtn = document.querySelector('#clear-watchlist-btn');

  const render = () => {
    let movies = watchlistService.getWatchlist();
    const count = movies.length;

    // Update count badges
    if (countBadge) {
      countBadge.textContent = `${count} ${count === 1 ? 'Movie' : 'Movies'}`;
    }

    if (count === 0) {
      if (gridContainer) {
        gridContainer.innerHTML = '';
        gridContainer.appendChild(
          createEmptyState({
            icon: 'bookmark',
            title: 'Your Watchlist is empty',
            description: 'Save movies you want to watch later by clicking the bookmark icon on any movie card.',
            actionText: 'Discover Movies',
            actionHref: 'search.html'
          })
        );
      }
      if (clearBtn) clearBtn.style.display = 'none';
      if (searchInput) searchInput.disabled = true;
      if (sortSelect) sortSelect.disabled = true;
      return;
    }

    if (clearBtn) clearBtn.style.display = 'inline-flex';
    if (searchInput) searchInput.disabled = false;
    if (sortSelect) sortSelect.disabled = false;

    // Filter by search query
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      movies = movies.filter(m => m.title && m.title.toLowerCase().includes(query));
    }

    // Sort movies
    const sortBy = sortSelect ? sortSelect.value : 'added_desc';
    movies.sort((a, b) => {
      if (sortBy === 'added_desc') {
        return new Date(b.added_at || 0) - new Date(a.added_at || 0);
      }
      if (sortBy === 'rating_desc') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === 'year_desc') {
        return (b.release_date || '').localeCompare(a.release_date || '');
      }
      if (sortBy === 'title_asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    if (gridContainer) {
      gridContainer.innerHTML = '';
      if (movies.length === 0) {
        gridContainer.appendChild(
          createEmptyState({
            icon: 'search',
            title: 'No saved matches',
            description: 'No movies in your watchlist match your filter criteria.',
            actionText: 'Clear Filter',
            onActionClick: () => {
              if (searchInput) {
                searchInput.value = '';
                render();
              }
            }
          })
        );
        return;
      }

      const fragment = document.createDocumentFragment();
      movies.forEach(movie => {
        const card = createMovieCard(movie, {
          source: 'watchlist',
          onRemove: (id, cardEl) => {
            cardEl.classList.add('removing');
            setTimeout(() => {
              render();
            }, 250);
          }
        });
        if (card) fragment.appendChild(card);
      });
      gridContainer.appendChild(fragment);
    }
  };

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', debounce(render, 200));
  }

  // Sort change handler
  if (sortSelect) {
    sortSelect.addEventListener('change', render);
  }

  // Clear All button handler
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your entire Watchlist?')) {
        watchlistService.clearWatchlist();
        render();
      }
    });
  }

  render();
}
