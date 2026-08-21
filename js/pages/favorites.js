/**
 * Favorites Page Controller
 */

import { createEmptyState } from '../components/emptyState.js';
import { createMovieCard } from '../components/movieCard.js';
import { favoriteService } from '../services/favoriteService.js';
import { debounce } from '../utils/debounce.js';

export function initFavoritesPage() {
  const gridContainer = document.querySelector('#favorites-grid');
  const countBadge = document.querySelector('#favorites-header-count');
  const searchInput = document.querySelector('#favorites-search');
  const sortSelect = document.querySelector('#favorites-sort');
  const clearBtn = document.querySelector('#clear-favorites-btn');

  const render = () => {
    let movies = favoriteService.getFavorites();
    const count = movies.length;

    // Update count badges
    if (countBadge) {
      countBadge.textContent = `${count} ${count === 1 ? 'Favorite' : 'Favorites'}`;
    }

    if (count === 0) {
      if (gridContainer) {
        gridContainer.innerHTML = '';
        gridContainer.appendChild(
          createEmptyState({
            icon: 'heart',
            title: 'No Favorites Yet',
            description: 'Mark movies as your favorites by clicking the heart icon on any movie card or detail page.',
            actionText: 'Explore Trending',
            actionHref: 'index.html'
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
            title: 'No favorite matches',
            description: 'No favorite movies match your search query.',
            actionText: 'Clear Search',
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
          source: 'favorites',
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
      if (confirm('Are you sure you want to clear all your Favorites?')) {
        favoriteService.clearFavorites();
        render();
      }
    });
  }

  render();
}
