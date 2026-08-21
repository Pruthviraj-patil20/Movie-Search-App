/**
 * User Profile Page Controller
 */

import { requireAuth } from '../components/authGuard.js';
import { loader } from '../components/loader.js';
import { toast } from '../components/toast.js';
import { analyticsService } from '../services/analyticsService.js';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';
import { formatDate } from '../utils/formatters.js';

export async function initProfilePage() {
  const isAuth = await requireAuth();
  if (!isAuth) return;

  const user = authService.getUser();
  if (!user) return;

  loader.start();

  // Populate Header & Info
  const avatarWrap = document.querySelector('#profile-avatar-display');
  const nameDisplay = document.querySelector('#profile-header-name');
  const emailDisplay = document.querySelector('#profile-header-email');
  const memberSinceDisplay = document.querySelector('#profile-header-joined');
  const verifiedBadge = document.querySelector('#profile-verified-badge');

  const nameInput = document.querySelector('#profile-name-input');
  const emailInput = document.querySelector('#profile-email-input');
  const phoneInput = document.querySelector('#profile-phone-input');
  const countryInput = document.querySelector('#profile-country-input');
  const bioInput = document.querySelector('#profile-bio-input');
  const avatarFileInput = document.querySelector('#avatar-file-input');
  const removeAvatarBtn = document.querySelector('#remove-avatar-btn');
  const saveForm = document.querySelector('#profile-details-form');
  const saveBtn = document.querySelector('#profile-save-btn');

  // Stats Elements
  const statWatched = document.querySelector('#stat-watched-count');
  const statFavorites = document.querySelector('#stat-favorites-count');
  const statWatchlist = document.querySelector('#stat-watchlist-count');
  const statRating = document.querySelector('#stat-avg-rating');

  const updateAvatarUI = (u) => {
    if (!avatarWrap) return;
    const initials = (u.name || 'User').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    if (u.profileImage) {
      avatarWrap.innerHTML = `
        <img src="${u.profileImage}" alt="${u.name}" class="profile-avatar-img" />
        <label for="avatar-file-input" class="profile-avatar-overlay-btn" title="Change Photo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span>Change</span>
        </label>
      `;
      if (removeAvatarBtn) removeAvatarBtn.style.display = 'inline-flex';
    } else {
      avatarWrap.innerHTML = `
        <div class="profile-avatar-initials">${initials}</div>
        <label for="avatar-file-input" class="profile-avatar-overlay-btn" title="Upload Photo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span>Upload</span>
        </label>
      `;
      if (removeAvatarBtn) removeAvatarBtn.style.display = 'none';
    }
  };

  updateAvatarUI(user);

  if (nameDisplay) nameDisplay.textContent = user.name;
  if (emailDisplay) emailDisplay.textContent = user.email;
  if (memberSinceDisplay) memberSinceDisplay.textContent = `Member since ${formatDate(user.createdAt)}`;
  if (verifiedBadge) {
    verifiedBadge.innerHTML = user.emailVerified
      ? `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3);">✓ Verified</span>`
      : `<a href="verify-email.html" class="badge badge-accent" style="text-decoration: underline;">Unverified • Verify Now</a>`;
  }

  // Populate Input Fields
  if (nameInput) nameInput.value = user.name || '';
  if (emailInput) emailInput.value = user.email || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (countryInput) countryInput.value = user.country || '';
  if (bioInput) bioInput.value = user.bio || '';

  // Load User Stats
  analyticsService.getUserStats().then(stats => {
    if (statWatched) statWatched.textContent = stats.totalWatched;
    if (statFavorites) statFavorites.textContent = stats.totalFavorites;
    if (statWatchlist) statWatchlist.textContent = stats.totalWatchlist;
    if (statRating) statRating.textContent = stats.averageRating > 0 ? `${stats.averageRating} ★` : 'NR';
  }).finally(() => {
    loader.done();
  });

  // Avatar Upload Handler
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar file size must be less than 5MB.');
        return;
      }

      loader.start();
      try {
        const res = await userService.uploadAvatar(file);
        toast.success('Profile picture updated!');
        updateAvatarUI(res.user);
      } catch (err) {
        toast.error(err.message || 'Failed to upload profile image.');
      } finally {
        loader.done();
      }
    });
  }

  // Remove Avatar Handler
  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', async () => {
      loader.start();
      try {
        const res = await userService.removeAvatar();
        toast.info('Profile picture removed.');
        updateAvatarUI(res.user);
      } catch (err) {
        toast.error('Failed to remove avatar.');
      } finally {
        loader.done();
      }
    });
  }

  // Form Save Changes
  if (saveForm) {
    saveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>Saving changes...</span>';

      try {
        const res = await userService.updateProfile({
          name: nameInput.value,
          phone: phoneInput.value,
          country: countryInput.value,
          bio: bioInput.value
        });

        toast.success('Profile details updated successfully!');
        if (nameDisplay) nameDisplay.textContent = res.user.name;
        updateAvatarUI(res.user);
      } catch (err) {
        toast.error(err.message || 'Failed to update profile.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>Save Profile</span>';
      }
    });
  }
}
