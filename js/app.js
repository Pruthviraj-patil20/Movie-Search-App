/**
 * CineSphere Main Application Bootstrapper
 */

import { initNavbar } from './components/navbar.js';
import { initFavoritesPage } from './pages/favorites.js';
import { initHomePage } from './pages/home.js';
import { initMovieDetailsPage } from './pages/movieDetails.js';
import { initSearchPage } from './pages/search.js';
import { initWatchlistPage } from './pages/watchlist.js';
import { themeService } from './services/themeService.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Dark / Light)
  themeService.initTheme();

  // 2. Initialize Navigation Bar & Drawer
  initNavbar();

  // 3. Page-Specific Dispatcher
  const path = window.location.pathname.toLowerCase();

  if (document.querySelector('#hero-mount')) {
    initHomePage();
  } else if (document.querySelector('#search-results-grid')) {
    initSearchPage();
  } else if (document.querySelector('#movie-details-mount')) {
    initMovieDetailsPage();
  } else if (document.querySelector('#watchlist-grid')) {
    initWatchlistPage();
  } else if (document.querySelector('#favorites-grid')) {
    initFavoritesPage();
  }
});
