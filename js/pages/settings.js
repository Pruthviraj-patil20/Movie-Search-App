/**
 * Account Settings Page Controller
 */

import { requireAuth } from '../components/authGuard.js';
import { loader } from '../components/loader.js';
import { toast } from '../components/toast.js';
import { authService } from '../services/authService.js';
import { themeService } from '../services/themeService.js';
import { userMovieService } from '../services/userMovieService.js';
import { userService } from '../services/userService.js';

export async function initSettingsPage() {
  const isAuth = await requireAuth();
  if (!isAuth) return;

  const user = authService.getUser();
  const preferences = authService.getPreferences();

  // Password Form
  const passwordForm = document.querySelector('#change-password-form');
  const currentPassInput = document.querySelector('#settings-current-password');
  const newPassInput = document.querySelector('#settings-new-password');
  const confirmPassInput = document.querySelector('#settings-confirm-password');
  const passSubmitBtn = document.querySelector('#change-pass-btn');

  // Notifications Toggles
  const notifEmail = document.querySelector('#notif-email-toggle');
  const notifRecs = document.querySelector('#notif-recs-toggle');
  const notifWatchlist = document.querySelector('#notif-watchlist-toggle');

  // Privacy Actions
  const clearSearchBtn = document.querySelector('#clear-search-history-btn');
  const clearWatchedBtn = document.querySelector('#clear-watched-history-btn');

  // Danger Zone
  const deleteAccountBtn = document.querySelector('#delete-account-btn');

  // Populate Preferences
  if (preferences && preferences.notifications) {
    if (notifEmail) notifEmail.checked = Boolean(preferences.notifications.email);
    if (notifRecs) notifRecs.checked = Boolean(preferences.notifications.recommendations);
    if (notifWatchlist) notifWatchlist.checked = Boolean(preferences.notifications.watchlistReminders);
  }

  // Password Change Handler
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPassword = currentPassInput.value;
      const newPassword = newPassInput.value;
      const confirmPassword = confirmPassInput.value;

      if (!currentPassword || !newPassword) {
        toast.error('Please enter your current and new password.');
        return;
      }

      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long.');
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match.');
        return;
      }

      passSubmitBtn.disabled = true;
      passSubmitBtn.innerHTML = '<span>Updating password...</span>';

      try {
        await userService.changePassword(currentPassword, newPassword);
        toast.success('Password changed successfully!');
        passwordForm.reset();
      } catch (err) {
        toast.error(err.message || 'Failed to change password.');
      } finally {
        passSubmitBtn.disabled = false;
        passSubmitBtn.innerHTML = '<span>Update Password</span>';
      }
    });
  }

  // Notification Toggles Change
  const saveNotifPreferences = async () => {
    const notifications = {
      email: notifEmail ? notifEmail.checked : true,
      recommendations: notifRecs ? notifRecs.checked : true,
      watchlistReminders: notifWatchlist ? notifWatchlist.checked : true
    };
    try {
      await userService.updatePreferences({ notifications });
      toast.success('Notification preferences updated.');
    } catch (e) {
      toast.error('Failed to save preferences.');
    }
  };

  [notifEmail, notifRecs, notifWatchlist].forEach(toggle => {
    if (toggle) toggle.addEventListener('change', saveNotifPreferences);
  });

  // Clear Search History Handler
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', async () => {
      if (confirm('Clear your entire search history?')) {
        await userMovieService.clearSearchHistory();
        toast.info('Search history cleared.');
      }
    });
  }

  // Clear Watched History Handler
  if (clearWatchedBtn) {
    clearWatchedBtn.addEventListener('click', async () => {
      if (confirm('Clear your entire watched movies history?')) {
        await userMovieService.clearWatched();
        toast.info('Watched history cleared.');
      }
    });
  }

  // Delete Account Handler
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      const password = prompt('⚠️ DANGER ZONE: This action is irreversible. All your watchlists, favorites, ratings, and profile data will be permanently deleted.\n\nPlease enter your password to confirm deletion:');
      if (!password) return;

      loader.start();
      try {
        await userService.deleteAccount(password);
        toast.info('Account deleted. We are sad to see you go!');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } catch (err) {
        toast.error(err.message || 'Failed to delete account. Please verify your password.');
      } finally {
        loader.done();
      }
    });
  }
}
