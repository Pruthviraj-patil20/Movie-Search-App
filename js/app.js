/**
 * CineSphere Main Application Bootstrapper
 */

import { initNavbar } from './components/navbar.js';
import { initCategoryPage } from './pages/category.js';
import { initDashboardPage } from './pages/dashboard.js';
import { initFavoritesPage } from './pages/favorites.js';
import { initForgotPasswordPage } from './pages/forgotPassword.js';
import { initHomePage } from './pages/home.js';
import { initLoginPage } from './pages/login.js';
import { initMovieDetailsPage } from './pages/movieDetails.js';
import { initProfilePage } from './pages/profile.js';
import { initResetPasswordPage } from './pages/resetPassword.js';
import { initSearchPage } from './pages/search.js';
import { initSettingsPage } from './pages/settings.js';
import { initSignupPage } from './pages/signup.js';
import { initWatchlistPage } from './pages/watchlist.js';
import { authService } from './services/authService.js';
import { themeService } from './services/themeService.js';

function bootstrapApp() {
  try {
    // 1. Initialize Theme (Dark / Light)
    themeService.initTheme();

    // 2. Initialize Auth State (Async in background)
    authService.init();

    // 3. Initialize Navigation Bar & User Profile Dropdown
    initNavbar();

    // 4. Page-Specific Dispatcher
    if (document.querySelector('#hero-mount')) {
      initHomePage();
    } else if (document.querySelector('#category-movies-grid') || document.querySelector('#categorySection') || document.querySelector('#category-cards-grid')) {
      initCategoryPage();
    } else if (document.querySelector('#search-results-grid')) {
      initSearchPage();
    } else if (document.querySelector('#movie-details-mount')) {
      initMovieDetailsPage();
    } else if (document.querySelector('#watchlist-grid')) {
      initWatchlistPage();
    } else if (document.querySelector('#favorites-grid')) {
      initFavoritesPage();
    } else if (document.querySelector('#login-form')) {
      initLoginPage();
    } else if (document.querySelector('#signup-form')) {
      initSignupPage();
    } else if (document.querySelector('#forgot-form')) {
      initForgotPasswordPage();
    } else if (document.querySelector('#reset-form')) {
      initResetPasswordPage();
    } else if (document.querySelector('#profile-details-form')) {
      initProfilePage();
    } else if (document.querySelector('#change-password-form') || document.querySelector('#delete-account-btn')) {
      initSettingsPage();
    } else if (document.querySelector('#dashboard-recent-mount') || document.querySelector('#dashboard-recs-mount')) {
      initDashboardPage();
    }
  } catch (err) {
    console.error('[CineSphere App] Bootstrapping error:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
