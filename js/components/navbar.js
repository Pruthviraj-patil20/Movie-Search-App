/**
 * Navbar Component Controller with LocalStorage Auth & Profile Dropdown
 * Pure frontend - no backend API required. Uses localStorage for auth state.
 */

import { authService, AUTH_EVENT } from '../services/authService.js';
import { favoriteService, FAVORITES_EVENT } from '../services/favoriteService.js';
import { themeService, THEME_EVENT } from '../services/themeService.js';
import { watchlistService, WATCHLIST_EVENT } from '../services/watchlistService.js';
import { onEvent } from '../utils/helpers.js';
import { toast } from './toast.js';

export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // 1. Highlight Active Page Link
  const currentPath = window.location.pathname.toLowerCase();
  const currentSearch = window.location.search.toLowerCase();
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const lowerHref = href.toLowerCase();

    if (
      (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/')) &&
      (lowerHref === 'index.html' || lowerHref === './' || lowerHref === '/')
    ) {
      link.classList.add('active');
    } else if (lowerHref.includes('cat=upcoming-movies')) {
      if (currentPath.includes('category.html') && currentSearch.includes('upcoming-movies')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else if (lowerHref === 'category.html') {
      if (currentPath.includes('category.html') && !currentSearch.includes('upcoming-movies')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } else if (lowerHref !== 'index.html' && lowerHref !== './' && lowerHref !== '/' && currentPath.includes(lowerHref.split('?')[0])) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 2. Sync Watchlist & Favorites Count Badges
  const updateBadges = async () => {
    try {
      const watchCount = await watchlistService.getCount();
      const favCount = await favoriteService.getCount();

      document.querySelectorAll('.watchlist-count-badge').forEach(badge => {
        badge.textContent = watchCount > 0 ? watchCount : '';
        badge.setAttribute('data-count', watchCount);
      });

      document.querySelectorAll('.favorites-count-badge').forEach(badge => {
        badge.textContent = favCount > 0 ? favCount : '';
        badge.setAttribute('data-count', favCount);
      });
    } catch (e) {}
  };

  updateBadges();
  onEvent(WATCHLIST_EVENT, updateBadges);
  onEvent(FAVORITES_EVENT, updateBadges);
  onEvent(AUTH_EVENT, updateBadges);

  // 3. User Authentication UI (Profile Dropdown vs Sign In Button)
  const renderUserMenu = () => {
    const userContainer = document.querySelector('.navbar-user-section');
    const mobileUserContainer = document.querySelector('.mobile-user-section');
    const user = authService.getUser();
    const isAuth = authService.isAuthenticated();

    if (userContainer) {
      if (isAuth && user) {
        const initials = (user.name || 'User')
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        const avatarImg = user.profileImage
          ? `<img src="${user.profileImage}" alt="${user.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
             <span style="display:none;">${initials}</span>`
          : `<span>${initials}</span>`;

        userContainer.innerHTML = `
          <div class="nav-user-wrapper">
            <button type="button" class="nav-user-trigger" id="user-menu-trigger" aria-label="Open user profile menu" aria-expanded="false">
              <div class="user-avatar-circle">${avatarImg}</div>
              <span class="nav-user-name">${user.name.split(' ')[0]}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            <div class="user-dropdown-menu" id="user-dropdown-menu" role="menu">
              <div class="dropdown-user-header">
                <div class="dropdown-user-name">${user.name}</div>
                <div class="dropdown-user-email">${user.email}</div>
              </div>

              <a href="dashboard.html" class="dropdown-item" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Personal Dashboard</span>
              </a>

              <a href="profile.html" class="dropdown-item" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Edit Profile</span>
              </a>

              <a href="settings.html" class="dropdown-item" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Account Settings</span>
              </a>

              <a href="watchlist.html" class="dropdown-item" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                <span>My Watchlist</span>
              </a>

              <a href="favorites.html" class="dropdown-item" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>Favorites</span>
              </a>

              <div class="dropdown-divider"></div>

              <button type="button" class="dropdown-item logout-btn" id="navbar-logout-btn" role="menuitem">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        `;

        // Bind dropdown toggling
        const trigger = userContainer.querySelector('#user-menu-trigger');
        const menu = userContainer.querySelector('#user-dropdown-menu');
        const logoutBtn = userContainer.querySelector('#navbar-logout-btn');

        if (trigger && menu) {
          const toggleMenu = (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('open');
            if (isOpen) {
              menu.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            } else {
              menu.classList.add('open');
              trigger.setAttribute('aria-expanded', 'true');
            }
          };

          trigger.addEventListener('click', toggleMenu);

          // Close on outside click
          document.addEventListener('click', (e) => {
            if (!userContainer.contains(e.target)) {
              menu.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            }
          });

          // Close on ESC
          window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
              menu.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
              trigger.focus();
            }
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener('click', async () => {
            await authService.logout();
            toast.info('Logged out successfully');
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 300);
          });
        }
      } else {
        // Logged Out State -> Sign In Button
        userContainer.innerHTML = `
          <a href="login.html" class="btn btn-primary btn-sm" aria-label="Sign In">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span>Sign In</span>
          </a>
        `;
      }
    }

    // Mobile Drawer Sync
    if (mobileUserContainer) {
      if (isAuth && user) {
        mobileUserContainer.innerHTML = `
          <div style="padding: var(--space-3); background: var(--bg-tertiary); border-radius: var(--radius-md); margin-bottom: var(--space-3);">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">${user.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</div>
          </div>
          <a href="dashboard.html" class="mobile-nav-link"><span>Dashboard</span></a>
          <a href="profile.html" class="mobile-nav-link"><span>Edit Profile</span></a>
          <a href="settings.html" class="mobile-nav-link"><span>Settings</span></a>
          <button type="button" class="mobile-nav-link logout-btn" id="mobile-logout-btn" style="width: 100%; text-align: left; color: #FF4D61; background: transparent; border: none;">
            <span>Log Out</span>
          </button>
        `;

        const mobileLogout = mobileUserContainer.querySelector('#mobile-logout-btn');
        if (mobileLogout) {
          mobileLogout.addEventListener('click', async () => {
            await authService.logout();
            toast.info('Logged out successfully');
            window.location.href = 'index.html';
          });
        }
      } else {
        mobileUserContainer.innerHTML = `
          <div style="display: flex; gap: var(--space-2); margin-top: var(--space-2);">
            <a href="login.html" class="btn btn-primary" style="flex: 1;">Sign In</a>
            <a href="signup.html" class="btn btn-secondary" style="flex: 1;">Sign Up</a>
          </div>
        `;
      }
    }
  };

  renderUserMenu();
  onEvent(AUTH_EVENT, renderUserMenu);

  // 4. Theme Toggle Functionality
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

  // 5. Scroll State Effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 6. Mobile Drawer Toggle
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

  // 7. Global Shortcut key ('/' or 'Cmd+K')
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      window.location.href = 'search.html';
    }
  });
}