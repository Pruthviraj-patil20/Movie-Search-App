/**
 * Route Authentication Guard
 */

import { authService } from '../services/authService.js';

export async function requireAuth(returnUrl) {
  await authService.init();
  if (!authService.isAuthenticated()) {
    const target = returnUrl || (window.location.pathname + window.location.search);
    window.location.href = `login.html?redirect=${encodeURIComponent(target)}`;
    return false;
  }
  return true;
}

export async function requireGuest(redirectUrl = 'dashboard.html') {
  await authService.init();
  if (authService.isAuthenticated()) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}
