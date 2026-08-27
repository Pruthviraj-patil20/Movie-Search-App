/**
 * Search & Discovery Page Controller
 * Supports debounced queries, live suggestions, search history, advanced filters, and pagination
 */

import { CONFIG } from '../config.js';
import { getMovieGenres } from '../api/genres.js';
import { discoverMovies, searchMovies, getUpcomingMovies } from '../api/movies.js';
import { createMovieCarousel } from '../components/carousel.js';
import { createEmptyState } from '../components/emptyState.js';
import { loader } from '../components/loader.js';
import { renderMovieGrid } from '../components/movieGrid.js';
import { skeleton } from '../components/skeleton.js';
import { storageService } from '../services/storage.js';
import { debounce } from '../utils/debounce.js';
import { formatRating, formatYear } from '../utils/formatters.js';
import { getImageUrl } from '../utils/helpers.js';
import { getAllUrlParams, updateUrlParams } from '../utils/urlParams.js';
import { sanitizeQuery } from '../utils/validators.js';
import { ALL_LANGUAGES_DATA } from '../data/allLanguagesData.js';

let currentPage = 1;
let totalPages = 1;
let currentResults = [];
let isLoading = false;

export async function initSearchPage() {
  const searchInput = document.querySelector('#search-input');
  const clearBtn = document.querySelector('#search-clear-btn');
  const suggestionsBox = document.querySelector('#search-suggestions');
  const historyContainer = document.querySelector('#search-history-container');
  const gridContainer = document.querySelector('#search-results-grid');
  const resultsCountEl = document.querySelector('#results-count-text');
  const loadMoreBtn = document.querySelector('#load-more-btn');
  const resetFiltersBtn = document.querySelector('#reset-filters-btn');

  // Filter Elements
  const genreSelect = document.querySelector('#filter-genre');
  const yearSelect = document.querySelector('#filter-year');
  const ratingSelect = document.querySelector('#filter-rating');
  const languageSelect = document.querySelector('#filter-language');
  const sortSelect = document.querySelector('#filter-sort');

  // 1. Populate Genre Dropdown
  try {
    const genres = await getMovieGenres();
    if (genreSelect) {
      genreSelect.innerHTML = '<option value="">All Genres</option>';
      genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = g.name;
        genreSelect.appendChild(opt);
      });
    }
  } catch (e) {
    console.warn('Could not populate genres filter', e);
  }

  // 1b. Render Upcoming Movies Showcase (Side of Discover)
  const upcomingMount = document.querySelector('#discover-upcoming-mount');
  const upcomingSection = document.querySelector('#discover-upcoming-section');
  if (upcomingMount) {
    const curatedUpcoming = ALL_LANGUAGES_DATA['upcoming-movies']?.movies || [];
    if (curatedUpcoming.length > 0) {
      upcomingMount.innerHTML = '';
      upcomingMount.appendChild(
        createMovieCarousel(curatedUpcoming, { title: 'Anticipated In Theaters (2025 - 2026)' })
      );
    } else if (upcomingSection) {
      upcomingSection.style.display = 'none';
    }
  }

  // 2. Read URL Parameters
  const initialParams = getAllUrlParams();
  if (initialParams.query && searchInput) {
    searchInput.value = initialParams.query;
    if (clearBtn) clearBtn.classList.add('visible');
  }
  if (initialParams.genre && genreSelect) {
    genreSelect.value = initialParams.genre;
  }
  if (initialParams.year && yearSelect) {
    yearSelect.value = initialParams.year;
  }
  if (initialParams.minRating && ratingSelect) {
    ratingSelect.value = initialParams.minRating;
  }
  if (initialParams.language && languageSelect) {
    languageSelect.value = initialParams.language;
  }
  if (initialParams.sortBy && sortSelect) {
    sortSelect.value = initialParams.sortBy;
  }

  // 3. Search History Manager
  const getSearchHistory = () => storageService.get(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, []);
  
  const saveToHistory = (query) => {
    const clean = sanitizeQuery(query);
    if (!clean || clean.length < 2) return;
    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== clean.toLowerCase());
    history.unshift(clean);
    if (history.length > CONFIG.MAX_SEARCH_HISTORY) {
      history = history.slice(0, CONFIG.MAX_SEARCH_HISTORY);
    }
    storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, history);
    renderHistory();
  };

  const removeFromHistory = (query) => {
    let history = getSearchHistory();
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    storageService.set(CONFIG.STORAGE_KEYS.SEARCH_HISTORY, history);
    renderHistory();
  };

  const renderHistory = () => {
    if (!historyContainer) return;
    const history = getSearchHistory();
    if (history.length === 0) {
      historyContainer.innerHTML = '';
      historyContainer.style.display = 'none';
      return;
    }

    historyContainer.style.display = 'flex';
    historyContainer.innerHTML = `
      <span class="history-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/>
        </svg>
        Recent Searches:
      </span>
    `;

    history.forEach(term => {
      const pill = document.createElement('div');
      pill.className = 'history-pill';
      pill.innerHTML = `
        <span class="history-pill-text">${term}</span>
        <button type="button" class="history-pill-remove" aria-label="Remove search term">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      pill.querySelector('.history-pill-text').addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = term;
          if (clearBtn) clearBtn.classList.add('visible');
          executeSearch(1, true);
        }
      });

      pill.querySelector('.history-pill-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromHistory(term);
      });

      historyContainer.appendChild(pill);
    });
  };

  renderHistory();

  // 4. Main Search & Filter Execution
  const executeSearch = async (page = 1, shouldScroll = false) => {
    if (isLoading) return;
    isLoading = true;
    currentPage = page;

    const query = sanitizeQuery(searchInput ? searchInput.value : '');
    const filters = {
      genre: genreSelect ? genreSelect.value : '',
      year: yearSelect ? yearSelect.value : '',
      minRating: ratingSelect ? ratingSelect.value : '',
      language: languageSelect ? languageSelect.value : '',
      sortBy: sortSelect ? sortSelect.value : 'popularity.desc'
    };

    // Sync to URL
    updateUrlParams({
      query: query || null,
      genre: filters.genre || null,
      year: filters.year || null,
      minRating: filters.minRating || null,
      language: filters.language || null,
      sortBy: filters.sortBy !== 'popularity.desc' ? filters.sortBy : null
    }, true);

    if (page === 1) {
      if (gridContainer) gridContainer.innerHTML = skeleton.grid(10);
      loader.start();
      if (query) saveToHistory(query);
    }

    try {
      let data;
      if (query) {
        data = await searchMovies(query, page, filters);
      } else {
        data = await discoverMovies({ ...filters, page });
      }

      totalPages = data.total_pages || 1;
      const results = data.results || [];

      if (page === 1) {
        currentResults = results;
        if (resultsCountEl) {
          const totalCount = data.total_results || results.length;
          resultsCountEl.innerHTML = query
            ? `Found <span>${totalCount}</span> results for "${query}"`
            : `Showing <span>${totalCount}</span> discovered titles`;
        }

        if (gridContainer) {
          if (results.length === 0) {
            gridContainer.innerHTML = '';
            gridContainer.appendChild(
              createEmptyState({
                icon: 'search',
                title: 'No movies match your search',
                description: 'We couldn’t find any matches. Try searching with different keywords or clearing your active filters.',
                actionText: 'Reset All Filters',
                onActionClick: () => resetAllFilters()
              })
            );
          } else {
            renderMovieGrid(gridContainer, results);
          }
        }
      } else {
        currentResults = [...currentResults, ...results];
        // Append additional items
        if (gridContainer) {
          const fragment = document.createDocumentFragment();
          results.forEach(movie => {
            const card = renderMovieGrid(fragment, [movie]);
          });
          gridContainer.appendChild(fragment);
        }
      }

      // Load More Button visibility
      if (loadMoreBtn) {
        loadMoreBtn.style.display = (currentPage < totalPages && results.length > 0) ? 'inline-flex' : 'none';
      }

      if (shouldScroll && page === 1 && gridContainer) {
        gridContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('[SearchPage] Error searching:', error);
      if (gridContainer && page === 1) {
        gridContainer.innerHTML = '';
        gridContainer.appendChild(
          createEmptyState({
            icon: 'alert',
            title: 'Something went wrong',
            description: 'Unable to connect to the movie database. Please check your network or try again.',
            actionText: 'Try Again',
            onActionClick: () => executeSearch(1)
          })
        );
      }
    } finally {
      isLoading = false;
      loader.done();
    }
  };

  // 5. Debounced Live Suggestions Dropdown
  const fetchSuggestions = debounce(async (query) => {
    if (!suggestionsBox) return;
    const clean = sanitizeQuery(query);
    if (clean.length < 2) {
      suggestionsBox.classList.remove('visible');
      suggestionsBox.innerHTML = '';
      return;
    }

    try {
      const data = await searchMovies(clean, 1);
      const suggestions = (data.results || []).slice(0, 5);

      if (suggestions.length === 0) {
        suggestionsBox.classList.remove('visible');
        return;
      }

      suggestionsBox.innerHTML = suggestions.map(movie => {
        const poster = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_SMALL);
        const year = formatYear(movie.release_date);
        const rating = formatRating(movie.vote_average);
        return `
          <a href="movie.html?id=${movie.id}" class="suggestion-item" data-id="${movie.id}">
            <img src="${poster}" alt="${movie.title}" class="suggestion-poster" />
            <div class="suggestion-info">
              <span class="suggestion-title">${movie.title}</span>
              <span class="suggestion-meta">
                <span>★ ${rating}</span>
                <span>•</span>
                <span>${year}</span>
              </span>
            </div>
          </a>
        `;
      }).join('');

      suggestionsBox.classList.add('visible');
    } catch (e) {
      suggestionsBox.classList.remove('visible');
    }
  }, 250);

  // 6. Search Input Handlers
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('visible', Boolean(val));
      fetchSuggestions(val);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (suggestionsBox) suggestionsBox.classList.remove('visible');
        executeSearch(1, true);
      }
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox?.contains(e.target)) {
        if (suggestionsBox) suggestionsBox.classList.remove('visible');
      }
    });
  }

  // Clear Input Button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearBtn.classList.remove('visible');
      if (suggestionsBox) suggestionsBox.classList.remove('visible');
      executeSearch(1);
    });
  }

  // 7. Filter Change Handlers
  [genreSelect, yearSelect, ratingSelect, languageSelect, sortSelect].forEach(select => {
    if (select) {
      select.addEventListener('change', () => {
        executeSearch(1, true);
      });
    }
  });

  // Reset Filters Handler
  const resetAllFilters = () => {
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');
    if (genreSelect) genreSelect.value = '';
    if (yearSelect) yearSelect.value = '';
    if (ratingSelect) ratingSelect.value = '';
    if (languageSelect) languageSelect.value = '';
    if (sortSelect) sortSelect.value = 'popularity.desc';
    executeSearch(1);
  };

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Load More Button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        executeSearch(currentPage + 1, false);
      }
    });
  }

  // Initial Execution
  executeSearch(1);
}
