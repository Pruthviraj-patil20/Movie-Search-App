/**
 * Reset Password Page Controller
 */

import { toast } from '../components/toast.js';
import { authService } from '../services/authService.js';
import { getUrlParam } from '../utils/urlParams.js';

export function initResetPasswordPage() {
  const token = getUrlParam('token');
  const form = document.querySelector('#reset-form');
  const passwordInput = document.querySelector('#reset-password');
  const confirmInput = document.querySelector('#reset-confirm-password');
  const submitBtn = document.querySelector('#reset-submit-btn');
  const alertBox = document.querySelector('#reset-alert');

  const showAlert = (message, type = 'error') => {
    if (!alertBox) return;
    alertBox.className = `auth-alert show alert-${type}`;
    alertBox.innerHTML = `<span>${message}</span>`;
  };

  if (!token) {
    showAlert('Invalid or missing password reset token. Please request a new link from the forgot password page.');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = passwordInput.value;
      const confirm = confirmInput.value;

      if (!password || password.length < 8) {
        showAlert('Password must be at least 8 characters.');
        return;
      }

      if (password !== confirm) {
        showAlert('Passwords do not match.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Updating password...</span>';

      try {
        const res = await authService.resetPassword(token, password);
        toast.success(res.message || 'Password reset successfully!');
        showAlert('Password reset successfully! Redirecting to Sign In...', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      } catch (err) {
        showAlert(err.message || 'Failed to reset password. Link may be expired.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Set New Password</span>';
      }
    });
  }
}
