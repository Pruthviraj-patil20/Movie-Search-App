/**
 * Validation & Sanitization Utilities
 */

/**
 * Check if movie ID is a valid positive integer
 */
export function isValidMovieId(id) {
  if (!id) return false;
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}

/**
 * Sanitize search query input
 */
export function sanitizeQuery(query) {
  if (!query) return '';
  return query.trim().replace(/[<>]/g, '');
}

/**
 * Validate year format (YYYY)
 */
export function isValidYear(year) {
  if (!year) return true;
  const y = parseInt(year, 10);
  return !isNaN(y) && y >= 1880 && y <= new Date().getFullYear() + 5;
}
