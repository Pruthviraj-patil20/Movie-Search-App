/**
 * Login Page Controller
 */

import { requireGuest } from '../components/authGuard.js';
import { toast } from '../components/toast.js';
import { authService } from '../services/authService.js';
import { getUrlParam } from '../utils/urlParams.js';

export async function initLoginPage() {
  // If already logged in, redirect
  await requireGuest('dashboard.html');

  const form = document.querySelector('#login-form');
  const emailInput = document.querySelector('#login-email');
  const passwordInput = document.querySelector('#login-password');
  const rememberCheckbox = document.querySelector('#login-remember');
  const submitBtn = document.querySelector('#login-submit-btn');
  const alertBox = document.querySelector('#login-alert');
  const togglePassBtn = document.querySelector('#login-toggle-password');

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

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

      if (!email || !password) {
        showAlert('Please enter both email and password.');
        return;
      }

      submitBtn.disabled = true;
      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Signing in...</span>`;

      try {
        await authService.login(email, password, rememberMe);
        toast.success('Welcome back!');

        // Check for return redirect URL
        const redirect = getUrlParam('redirect');
        setTimeout(() => {
          window.location.href = redirect ? decodeURIComponent(redirect) : 'dashboard.html';
        }, 300);
      } catch (error) {
        showAlert(error.message || 'Invalid email or password. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }
}
