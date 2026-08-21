/**
 * Email Notification & Link Generator Simulator
 */

import crypto from 'crypto';

export function generateTokenHex() {
  return crypto.randomBytes(32).toString('hex');
}

export function sendVerificationEmail(email, name, token, req) {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol || 'http';
  const verifyUrl = `${protocol}://${host}/verify-email.html?token=${token}`;

  console.log('====================================================');
  console.log(`✉️ [EMAIL SIMULATOR] To: ${name} <${email}>`);
  console.log(`Subject: Verify your CineSphere Email Address`);
  console.log(`Verification Link: ${verifyUrl}`);
  console.log('====================================================');

  return { success: true, verifyUrl };
}

export function sendPasswordResetEmail(email, name, token, req) {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol || 'http';
  const resetUrl = `${protocol}://${host}/reset-password.html?token=${token}`;

  console.log('====================================================');
  console.log(`✉️ [EMAIL SIMULATOR] To: ${name} <${email}>`);
  console.log(`Subject: Reset your CineSphere Password`);
  console.log(`Password Reset Link: ${resetUrl}`);
  console.log('====================================================');

  return { success: true, resetUrl };
}
