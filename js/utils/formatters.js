/**
 * Formatting Utilities
 */

/**
 * Format runtime minutes into hours and minutes (e.g. 148 -> "2h 28m")
 */
export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format date string into human readable date (e.g. "2024-03-01" -> "Mar 1, 2024")
 */
export function formatDate(dateString) {
  if (!dateString) return 'TBA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Extract 4-digit release year (e.g. "2024-03-01" -> "2024")
 */
export function formatYear(dateString) {
  if (!dateString) return 'TBA';
  return dateString.split('-')[0] || 'TBA';
}

/**
 * Format TMDB rating score to 1 decimal place (e.g. 8.412 -> "8.4")
 */
export function formatRating(score) {
  if (score === undefined || score === null || isNaN(score) || score === 0) return 'NR';
  return Number(score).toFixed(1);
}

/**
 * Format large numbers to readable shorthand (e.g. 12450 -> "12.5K")
 */
export function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

/**
 * Format currency in USD (e.g. 150000000 -> "$150,000,000")
 */
export function formatCurrency(amount) {
  if (!amount || amount <= 0) return 'Not Disclosed';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
