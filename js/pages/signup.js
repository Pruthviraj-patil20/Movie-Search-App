/**
 * Sign Up Page Controller
 */

import { requireGuest } from '../components/authGuard.js';
import { toast } from '../components/toast.js';
import { authService } from '../services/authService.js';
import { getUrlParam } from '../utils/urlParams.js';

export async function initSignupPage() {
  await requireGuest('dashboard.html');

  const form = document.querySelector('#signup-form');
  const nameInput = document.querySelector('#signup-name');
  const emailInput = document.querySelector('#signup-email');
  const passwordInput = document.querySelector('#signup-password');
  const confirmInput = document.querySelector('#signup-confirm-password');
  const submitBtn = document.querySelector('#signup-submit-btn');
  const alertBox = document.querySelector('#signup-alert');
  const togglePassBtn = document.querySelector('#signup-toggle-password');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.querySelector('#password-strength-label');

  // Password visibility toggle
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassBtn.innerHTML = type === 'password'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    });
  }

  // Live password strength calculation
  if (passwordInput && strengthBars.length > 0) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      strengthBars.forEach((bar, idx) => {
        if (idx < score) {
          if (score <= 1) bar.style.background = '#EF4444';
          else if (score <= 2) bar.style.background = '#F59E0B';
          else if (score <= 3) bar.style.background = '#3B82F6';
          else bar.style.background = '#10B981';
        } else {
          bar.style.background = 'var(--border-subtle)';
        }
      });

      if (strengthText) {
        if (score === 0) strengthText.textContent = 'Too weak (min 8 chars)';
        else if (score <= 2) strengthText.textContent = 'Medium password';
        else strengthText.textContent = 'Strong password';
      }
    });
  }

  const showAlert = (message, type = 'error') => {
    if (!alertBox) return;
    alertBox.className = `auth-alert show alert-${type}`;
    alertBox.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>${message}</span>
    `;
  };

  const hideAlert = () => {
    if (alertBox) alertBox.className = 'auth-alert';
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirm = confirmInput ? confirmInput.value : password;

      if (!name || !email || !password) {
        showAlert('Please fill in all required fields.');
        return;
      }

      if (password.length < 8) {
        showAlert('Password must be at least 8 characters long.');
        return;
      }

      if (password !== confirm) {
        showAlert('Passwords do not match. Please verify.');
        return;
      }

      submitBtn.disabled = true;
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Creating account...</span>`;

      try {
        await authService.signup(name, email, password);
        toast.success('Account created successfully! Welcome to CineSphere.');

        const redirect = getUrlParam('redirect');
        setTimeout(() => {
          window.location.href = redirect ? decodeURIComponent(redirect) : 'dashboard.html';
        }, 400);
      } catch (error) {
        showAlert(error.message || 'Registration failed. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
}
