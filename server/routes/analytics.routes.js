/**
 * User Analytics Routes
 * /api/analytics
 */

import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAuth, (req, res) => {
  try {
    const stats = db.getUserAnalytics(req.user.id);
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('[Analytics Route] Error computing stats:', error);
    res.status(500).json({ success: false, error: 'Internal server error computing analytics' });
  }
});

export default router;
