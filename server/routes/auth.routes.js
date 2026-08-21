/**
 * Authentication Routes
 * /api/auth
 */

import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { generateTokenHex, sendPasswordResetEmail, sendVerificationEmail } from '../utils/email.js';
import {
  generateToken,
  hashPassword,
  validateEmail,
  validatePasswordStrength,
  verifyPassword
} from '../utils/security.js';

const router = express.Router();

// Cookie options
const getCookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000 // 30 days or 7 days
});

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, error: passCheck.message });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists' });
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateTokenHex();

    const newUser = db.createUser({
      name,
      email,
      passwordHash,
      verificationToken,
      emailVerified: false
    });

    const token = generateToken(newUser, false);
    res.cookie('auth_token', token, getCookieOptions(false));

    // Send verification email simulation
    const emailResult = sendVerificationEmail(newUser.email, newUser.name, verificationToken, req);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: newUser,
      token,
      verificationUrl: emailResult.verifyUrl
    });
  } catch (error) {
    console.error('[Auth Route] Sign up error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during registration' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const userWithSecrets = db.findUserByEmail(email);
    if (!userWithSecrets) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await verifyPassword(password, userWithSecrets.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const safeUser = db.sanitizeUser(userWithSecrets);
    const token = generateToken(safeUser, Boolean(rememberMe));

    res.cookie('auth_token', token, getCookieOptions(Boolean(rememberMe)));

    res.json({
      success: true,
      message: 'Signed in successfully',
      user: safeUser,
      token
    });
  } catch (error) {
    console.error('[Auth Route] Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error during authentication' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, (req, res) => {
  const preferences = db.getUserPreferences(req.user.id);
  res.json({
    success: true,
    user: req.user,
    preferences
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required' });
    }

    const user = db.findUserByEmail(email);
    // Prevent email enumeration: Always respond with success message
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    const resetToken = generateTokenHex();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    db.updateUser(user.id, {
      resetToken,
      resetTokenExpires: resetExpires
    });

    const emailResult = sendPasswordResetEmail(user.email, user.name, resetToken, req);

    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
      resetUrl: emailResult.resetUrl // Included for testing convenience
    });
  } catch (error) {
    console.error('[Auth Route] Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Password reset token is required' });
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, error: passCheck.message });
    }

    const user = db.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Password reset link is invalid or has expired. Please request a new one.'
      });
    }

    const newHash = await hashPassword(password);
    db.updateUser(user.id, {
      passwordHash: newHash,
      resetToken: null,
      resetTokenExpires: null
    });

    res.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.'
    });
  } catch (error) {
    console.error('[Auth Route] Reset password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/verify-email
 */
router.post('/verify-email', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Verification token is required' });
    }

    const user = db.findUserByVerificationToken(token);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired email verification link' });
    }

    db.updateUser(user.id, {
      emailVerified: true,
      verificationToken: null
    });

    res.json({
      success: true,
      message: 'Your email has been verified successfully!'
    });
  } catch (error) {
    console.error('[Auth Route] Verify email error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/resend-verification
 */
router.post('/resend-verification', requireAuth, (req, res) => {
  try {
    const user = db.findUserById(req.user.id);
    if (user.emailVerified) {
      return res.json({ success: true, message: 'Your email is already verified.' });
    }

    const token = generateTokenHex();
    db.updateUser(user.id, { verificationToken: token });

    const emailResult = sendVerificationEmail(user.email, user.name, token, req);

    res.json({
      success: true,
      message: 'Verification link resent!',
      verificationUrl: emailResult.verifyUrl
    });
  } catch (error) {
    console.error('[Auth Route] Resend verification error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
