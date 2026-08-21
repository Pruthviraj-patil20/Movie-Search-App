/**
 * User Profile & Account Settings Routes
 * /api/users
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import {
  hashPassword,
  validatePasswordStrength,
  verifyPassword
} from '../utils/security.js';

const router = express.Router();

/**
 * PUT /api/users/profile
 */
router.put('/profile', requireAuth, (req, res) => {
  try {
    const { name, phone, country, bio } = req.body;

    const updates = {};
    if (name && name.trim()) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (country !== undefined) updates.country = country.trim();
    if (bio !== undefined) updates.bio = bio.trim();

    const updated = db.updateUser(req.user.id, updates);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updated
    });
  } catch (error) {
    console.error('[User Route] Update profile error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/users/avatar
 */
router.post('/avatar', requireAuth, uploadAvatar.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please select an image file to upload' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updated = db.updateUser(req.user.id, { profileImage: avatarUrl });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profileImage: avatarUrl,
      user: updated
    });
  } catch (error) {
    console.error('[User Route] Avatar upload error:', error);
    res.status(500).json({ success: false, error: error.message || 'Error uploading profile image' });
  }
});

/**
 * DELETE /api/users/avatar
 */
router.delete('/avatar', requireAuth, (req, res) => {
  try {
    const user = db.findUserById(req.user.id);
    if (user && user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'server', user.profileImage);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    const updated = db.updateUser(req.user.id, { profileImage: null });
    res.json({
      success: true,
      message: 'Profile photo removed',
      user: updated
    });
  } catch (error) {
    console.error('[User Route] Delete avatar error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PUT /api/users/password
 */
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required' });
    }

    const userWithSecret = db.findUserById(req.user.id);
    const isMatch = await verifyPassword(currentPassword, userWithSecret.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect current password' });
    }

    const passCheck = validatePasswordStrength(newPassword);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, error: passCheck.message });
    }

    const newHash = await hashPassword(newPassword);
    db.updateUser(req.user.id, { passwordHash: newHash });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('[User Route] Change password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/users/preferences
 */
router.get('/preferences', requireAuth, (req, res) => {
  const pref = db.getUserPreferences(req.user.id);
  res.json({ success: true, preferences: pref });
});

/**
 * PUT /api/users/preferences
 */
router.put('/preferences', requireAuth, (req, res) => {
  try {
    const pref = db.updateUserPreferences(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: pref
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * DELETE /api/users/account (Danger Zone)
 */
router.delete('/account', requireAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required to confirm account deletion' });
    }

    const userWithSecret = db.findUserById(req.user.id);
    const isMatch = await verifyPassword(password, userWithSecret.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Account deletion cancelled.' });
    }

    db.deleteUser(req.user.id);
    res.clearCookie('auth_token');

    res.json({
      success: true,
      message: 'Your account and all associated personal data have been permanently deleted.'
    });
  } catch (error) {
    console.error('[User Route] Account deletion error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
