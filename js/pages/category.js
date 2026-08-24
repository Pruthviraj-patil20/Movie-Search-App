/**
 * CineSphere Category Page Controller
 * Handles regional categories (Bollywood, Hollywood, South Indian), genres, sorting, and search
 */

import { CONFIG } from '../config.js';
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from '../api/movies.js';
import { createMovieCard } from '../components/movieCard.js';
import { skeleton } from '../components/skeleton.js';
import { getUrlParam, setUrlParam } from '../utils/urlParams.js';
import { debounce } from '../utils/debounce.js';

// Category definitions
const CATEGORIES = [
  { id: 'all', name: '🌟 All Movies', tag: 'All' },
  { id: 'bollywood', name: '🇮🇳 Bollywood', tag: 'Bollywood' },
  { id: 'hollywood', name: '🎬 Hollywood', tag: 'Hollywood' },
  { id: 'south-indian', name: '🌴 South Indian', tag: 'South Indian' },
  { id: 'trending', name: '🔥 Trending Now', tag: 'Trending' },
  { id: 'top-rated', name: '⭐ Top Rated', tag: 'Top Rated' },
  { id: 'action', name: '⚡ Action & Thriller', genreIds: [28, 53] },
  { id: 'scifi', name: '🚀 Sci-Fi & Adventure', genreIds: [878, 12] },
  { id: 'drama', name: '🎭 Drama & Stories', genreIds: [18, 36] },
  { id: 'comedy', name: '😂 Comedy', genreIds: [35] },
  { id: 'animation', name: '✨ Animation', genreIds: [16] }
];

// Curated regional movie mapping based on DEMO_MOVIES
const BOLLYWOOD_TITLES = ['Dangal', 'Sanju', 'Padmaavat', 'Bajrangi Bhaijaan', '3 Idiots', 'Dhoom 3'];
const HOLLYWOOD_TITLES = ['Inception', 'Interstellar', 'The Dark Knight', 'Dune: Part Two', 'Oppenheimer', 'Spider-Man: Across the Spider-Verse', 'Avatar: The Way of Water', 'Top Gun: Maverick', 'The Shawshank Redemption', 'Pulp Fiction', 'Fight Club', 'The Matrix', 'Gladiator', 'Avengers: Endgame', 'Whiplash', 'Blade Runner 2049', 'Spider-Man: No Way Home', 'The Batman', 'John Wick: Chapter 4', 'Barbie'];
const SOUTH_INDIAN_TITLES = ['RRR', 'Pushpa: The Rise', 'Kantara', 'Vikram Vedha', 'Drishyam', 'KGF Chapter 2', 'Bahubali'];

let currentCategory = 'all';
let currentSort = 'popular';
let currentSearchQuery = '';
let allLoadedMovies = [];

export async function initCategoryPage() {
  const navContainer = document.querySelector('#category-filter-nav');
  const gridContainer = document.querySelector('#category-movies-grid');
  const searchInput = document.querySelector('#category-search-input');
  const sortSelect = document.querySelector('#category-sort-select');
  const statusInfo = document.querySelector('#category-status-info');
  const totalBadge = document.querySelector('#category-total-badge');

  if (!gridContainer) return;

  // 1. Determine Initial Active Category from URL or default
  const paramCat = (getUrlParam('cat') || getUrlParam('category') || 'all').toLowerCase();
  const matchedCat = CATEGORIES.find(c => c.id === paramCat);
  currentCategory = matchedCat ? matchedCat.id : 'all';

  // 2. Render Category Navigation Buttons
  if (navContainer) {
    navContainer.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `category-pill-btn ${cat.id === currentCategory ? 'active' : ''}`;
      btn.dataset.category = cat.id;
      btn.setAttribute('aria-label', `View ${cat.name} movies`);
      btn.innerHTML = `
        <span>${cat.name}</span>
      `;

      btn.addEventListener('click', () => {
        if (currentCategory === cat.id) return;
        currentCategory = cat.id;
        setUrlParam('cat', cat.id);

        navContainer.querySelectorAll('.category-pill-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.category === cat.id);
        });

        loadAndRenderCategory();
      });

      navContainer.appendChild(btn);
    });
  }

  // 3. Setup Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      renderFilteredMovies();
    }, 250));
  }

  // 4. Setup Sort Selector Event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderFilteredMovies();
    });
  }

  // 5. Initial Load
  await loadAndRenderCategory();

  async function loadAndRenderCategory() {
    gridContainer.innerHTML = skeleton.grid(8);

    try {
      allLoadedMovies = await fetchMoviesForCategory(currentCategory);
    } catch (err) {
      console.warn('[CategoryPage] Fetch fallback:', err);
      allLoadedMovies = [...CONFIG.DEMO_MOVIES];
    }

    renderFilteredMovies();
  }

  function renderFilteredMovies() {
    let movies = [...allLoadedMovies];

    // Filter by category
    movies = filterByCategory(movies, currentCategory);

    // Filter by search query
    if (currentSearchQuery) {
      movies = movies.filter(m => 
        (m.title && m.title.toLowerCase().includes(currentSearchQuery)) ||
        (m.overview && m.overview.toLowerCase().includes(currentSearchQuery))
      );
    }

    // Sort movies
    sortMoviesList(movies, currentSort);

    // Update status and count
    const activeCatObj = CATEGORIES.find(c => c.id === currentCategory) || CATEGORIES[0];
    if (statusInfo) {
      const queryText = currentSearchQuery ? ` matching "${currentSearchQuery}"` : '';
      statusInfo.innerHTML = `Showing <span class="category-status-highlight">${movies.length}</span> movies in <span class="category-status-highlight">${activeCatObj.name}</span>${queryText}`;
    }
    if (totalBadge) {
      totalBadge.textContent = `${movies.length} Movies`;
    }

    // Render Grid
    gridContainer.innerHTML = '';

    if (movies.length === 0) {
      gridContainer.innerHTML = `
        <div class="category-empty-state">
          <div class="category-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 class="category-empty-title">No movies found</h3>
          <p class="category-empty-text">No movies match your selected category or filter. Try switching categories or clearing search.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-filter-btn">View All Movies</button>
        </div>
      `;

      const resetBtn = gridContainer.querySelector('#reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentSearchQuery = '';
          if (searchInput) searchInput.value = '';
          setUrlParam('cat', 'all');
          if (navContainer) {
            navContainer.querySelectorAll('.category-pill-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.category === 'all');
            });
          }
          loadAndRenderCategory();
        });
      }
      return;
    }

    movies.forEach(movie => {
      const card = createMovieCard(movie);
      if (card) gridContainer.appendChild(card);
    });
  }
}

async function fetchMoviesForCategory(categoryId) {
  // Start with full demo catalog to guarantee zero failures
  const demoList = [...CONFIG.DEMO_MOVIES];

  try {
    if (categoryId === 'trending') {
      const data = await getTrendingMovies('week');
      if (data && data.results && data.results.length > 0) {
        return mergeWithDemo(data.results, demoList);
      }
    } else if (categoryId === 'top-rated') {
      const data = await getTopRatedMovies();
      if (data && data.results && data.results.length > 0) {
        return mergeWithDemo(data.results, demoList);
      }
    } else if (categoryId === 'all' || categoryId === 'hollywood') {
      const data = await getPopularMovies();
      if (data && data.results && data.results.length > 0) {
        return mergeWithDemo(data.results, demoList);
      }
    }
  } catch (e) {
    console.warn('[CategoryPage] API request fell back to catalog:', e);
  }

  return demoList;
}

function mergeWithDemo(apiResults, demoMovies) {
  const ids = new Set(apiResults.map(m => m.id));
  const uniqueDemo = demoMovies.filter(m => !ids.has(m.id));
  return [...apiResults, ...uniqueDemo];
}

function filterByCategory(movies, categoryId) {
  if (categoryId === 'all') return movies;

  if (categoryId === 'bollywood') {
    return movies.filter(m => 
      BOLLYWOOD_TITLES.some(title => (m.title || '').toLowerCase().includes(title.toLowerCase())) ||
      (m.original_language === 'hi')
    );
  }

  if (categoryId === 'hollywood') {
    return movies.filter(m =>
      HOLLYWOOD_TITLES.some(title => (m.title || '').toLowerCase().includes(title.toLowerCase())) ||
      (m.original_language === 'en')
    );
  }

  if (categoryId === 'south-indian') {
    return movies.filter(m =>
      SOUTH_INDIAN_TITLES.some(title => (m.title || '').toLowerCase().includes(title.toLowerCase())) ||
      ['te', 'ta', 'kn', 'ml'].includes(m.original_language)
    );
  }

  if (categoryId === 'trending') {
    return [...movies].sort((a, b) => (b.popularity || b.vote_count || 0) - (a.popularity || a.vote_count || 0));
  }

  if (categoryId === 'top-rated') {
    return [...movies].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  }

  const catObj = CATEGORIES.find(c => c.id === categoryId);
  if (catObj && catObj.genreIds) {
    return movies.filter(m => {
      const gids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
      return catObj.genreIds.some(targetId => gids.includes(targetId));
    });
  }

  return movies;
}

function sortMoviesList(movies, sortBy) {
  if (sortBy === 'rating.desc') {
    movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (sortBy === 'release.desc') {
    movies.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
  } else if (sortBy === 'release.asc') {
    movies.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
  } else if (sortBy === 'title.asc') {
    movies.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else {
    // Default popularity / vote count
    movies.sort((a, b) => (b.vote_count || b.popularity || 0) - (a.vote_count || a.popularity || 0));
  }
}
