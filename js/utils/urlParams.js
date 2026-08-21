/**
 * URL Parameters Utility
 * Handles reading, updating, and syncing URL query parameters
 */

export function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export function getAllUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

export function setUrlParam(key, value, replaceHistory = false) {
  const url = new URL(window.location.href);
  if (value === undefined || value === null || value === '') {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  
  if (replaceHistory) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

export function updateUrlParams(paramsObj, replaceHistory = false) {
  const url = new URL(window.location.href);
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  if (replaceHistory) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}
