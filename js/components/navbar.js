/**
 * Navbar Component Controller
 * Manages active states, live counter badges, theme switcher, and mobile drawer
 */

import { favoriteService, FAVORITES_EVENT } from '../services/favoriteService.js';
import { themeService, THEME_EVENT } from '../services/themeService.js';
import { watchlistService, WATCHLIST_EVENT } from '../services/watchlistService.js';
import { onEvent } from '../utils/helpers.js';

export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // 1. Highlight Active Page Link
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) &&
      (href === 'index.html' || href === './' || href === '/')
    ) {
      link.classList.add('active');
    } else if (href !== 'index.html' && href !== './' && href !== '/' && currentPath.includes(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Sync Watchlist & Favorites Count Badges
  const updateBadges = () => {
    const watchCount = watchlistService.getCount();
    const favCount = favoriteService.getCount();

    document.querySelectorAll('.watchlist-count-badge').forEach(badge => {
      badge.textContent = watchCount > 0 ? watchCount : '';
      badge.setAttribute('data-count', watchCount);
    });

    document.querySelectorAll('.favorites-count-badge').forEach(badge => {
      badge.textContent = favCount > 0 ? favCount : '';
      badge.setAttribute('data-count', favCount);
    });
  };

  updateBadges();
  onEvent(WATCHLIST_EVENT, updateBadges);
  onEvent(FAVORITES_EVENT, updateBadges);

  // 3. Theme Toggle Functionality
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  const updateThemeIcons = (currentTheme) => {
    const isDark = currentTheme === 'dark';
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Switch to Light Mode"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" title="Switch to Dark Mode"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  };

  updateThemeIcons(themeService.getTheme());

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newTheme = themeService.toggleTheme();
      updateThemeIcons(newTheme);
    });
  });

  onEvent(THEME_EVENT, (e) => {
    updateThemeIcons(e.detail.theme);
  });

  // 4. Scroll State Effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 5. Mobile Drawer Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerCloseBtn = document.querySelector('.mobile-drawer-close-btn');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    document.body.classList.add('modal-open');
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    document.body.classList.remove('modal-open');
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // 6. Global Shortcut key (Press '/' or 'Cmd+K' to quickly navigate to Search)
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      window.location.href = 'search.html';
    }
  });
}
