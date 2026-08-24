/**
 * CineSphere Category Page Script
 * (Forwards to modern modular page module)
 */
import { initCategoryPage } from './js/pages/category.js';
import { themeService } from './js/services/themeService.js';
import { initNavbar } from './js/components/navbar.js';
import { authService } from './js/services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
  themeService.initTheme();
  authService.init();
  initNavbar();
  initCategoryPage();
});