/**
 * Forgot Password Page Controller
 */

import { authService } from '../services/authService.js';

export function initForgotPasswordPage() {
  const form = document.querySelector('#forgot-form');
  const emailInput = document.querySelector('#forgot-email');
  const submitBtn = document.querySelector('#forgot-submit-btn');
  const alertBox = document.querySelector('#forgot-alert');
  const simBox = document.querySelector('#simulated-link-box');

  const showAlert = (message, type = 'error') => {
    if (!alertBox) return;
    alertBox.className = `auth-alert show alert-${type}`;
    alertBox.innerHTML = `<span>${message}</span>`;
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) {
        showAlert('Please enter your email address.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending instructions...</span>';

      try {
        const res = await authService.forgotPassword(email);
        showAlert(res.message || 'Password reset link has been dispatched.', 'success');

        if (res.resetUrl && simBox) {
          simBox.style.display = 'block';
          simBox.innerHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border: 1px dashed var(--border-medium); border-radius: var(--radius-md); font-size: 0.8rem;">
              <strong style="color: var(--accent-gold);">⚡ Simulation Environment Reset Link:</strong><br/>
              <a href="${res.resetUrl}" style="color: var(--accent-primary); word-break: break-all; text-decoration: underline; margin-top: 6px; display: inline-block;">
                Click here to reset your password directly
              </a>
            </div>
          `;
        }
      } catch (err) {
        showAlert(err.message || 'Error processing request');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Reset Link</span>';
      }
    });
  }
}
