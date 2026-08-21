/**
 * Authentication Middleware
 * Enforces verified JWT token and populates req.user
 */

import { db } from '../db.js';
import { verifyToken } from '../utils/security.js';

export function requireAuth(req, res, next) {
  let token = null;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Check cookie if header not found
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in.'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please sign in again.'
    });
  }

  const user = db.findUserById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User account no longer exists.'
    });
  }

  req.user = db.sanitizeUser(user);
  next();
}

/**
 * Optional Auth Middleware (Doesn't block unauthenticated guests)
 */
export function optionalAuth(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      const user = db.findUserById(decoded.id);
      if (user) {
        req.user = db.sanitizeUser(user);
      }
    }
  }

  next();
}
