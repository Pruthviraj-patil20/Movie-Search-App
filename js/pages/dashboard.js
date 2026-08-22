/**
 * Personalized Dashboard Page Controller
 * Handles stats, recently viewed, recommendations, watchlist, and favorites
 * with proper error fallbacks for both guest and authenticated users.
 */

import { getGenreMap } from '../api/genres.js';
import { createMovieCarousel } from '../components/carousel.js';
import { createEmptyState } from '../components/emptyState.js';
import { loader } from '../components/loader.js';
import { skeleton } from '../components/skeleton.js';
import { analyticsService } from '../services/analyticsService.js';
import { authService } from '../services/authService.js';
import { recommendationService } from '../services/recommendationService.js';
import { userMovieService } from '../services/userMovieService.js';

export async function initDashboardPage() {
  await authService.init();

  const user = authService.getUser();
  const isAuth = authService.isAuthenticated();

  // Header Elements
  const greetingEl = document.querySelector('#dashboard-user-name');
  if (greetingEl) {
    greetingEl.textContent = isAuth && user ? user.name.split(' ')[0] : 'Film Lover';
  }

  // Carousel Mounts
  const recentMount = document.querySelector('#dashboard-recent-mount');
  const recsMount = document.querySelector('#dashboard-recs-mount');
  const recsReasonEl = document.querySelector('#dashboard-recs-reason');
  const watchlistMount = document.querySelector('#dashboard-watchlist-mount');
  const favoritesMount = document.querySelector('#dashboard-favorites-mount');
  const genreAnalyticsMount = document.querySelector('#dashboard-genre-analytics-mount');

  // Stats Counters
  const statWatched = document.querySelector('#dash-stat-watched');
  const statFavorites = document.querySelector('#dash-stat-favorites');
  const statWatchlist = document.querySelector('#dash-stat-watchlist');
  const statRating = document.querySelector('#dash-stat-rating');

  // Insert Skeletons immediately
  if (recentMount) recentMount.innerHTML = skeleton.carousel();
  if (recsMount) recsMount.innerHTML = skeleton.carousel();
  if (watchlistMount) watchlistMount.innerHTML = skeleton.carousel();
  if (favoritesMount) favoritesMount.innerHTML = skeleton.carousel();

  loader.start();

  try {
    // 1. Calculate & Render Stats
    if (isAuth) {
      analyticsService.getUserStats().then(stats => {
        if (statWatched) statWatched.textContent = stats.totalWatched || 0;
        if (statFavorites) statFavorites.textContent = stats.totalFavorites || 0;
        if (statWatchlist) statWatchlist.textContent = stats.totalWatchlist || 0;
        if (statRating) statRating.textContent = stats.averageRating > 0 ? `${stats.averageRating} ★` : 'NR';

        if (genreAnalyticsMount && stats.genreCounts) {
          renderGenreAnalytics(genreAnalyticsMount, stats.genreCounts);
        }
      }).catch(() => {
        renderDashboardStatsFallback();
      });
    } else {
      renderDashboardStatsFallback();
    }

    // 2. Load Recently Viewed & Continue Watching
    loadRecentlyViewed(recentMount);

    // 3. Load Personalized Recommendations
    await loadPersonalizedRecommendations(recsMount, recsReasonEl);

    // 4. Load Watchlist
    loadWatchlistPreview(watchlistMount);

    // 5. Load Favorites
    loadFavoritesPreview(favoritesMount);

    // 6. Load Genre Analytics (if not already rendered via auth stats)
    if (!isAuth && genreAnalyticsMount) {
      await loadGenreAnalytics(genreAnalyticsMount);
    }
  } catch (error) {
    console.error('[Dashboard] Error rendering dashboard:', error);
  } finally {
    loader.done();
  }
}

/**
 * Render stats fallback using local user movie data
 */
function renderDashboardStatsFallback() {
  const statWatched = document.querySelector('#dash-stat-watched');
  const statFavorites = document.querySelector('#dash-stat-favorites');
  const statWatchlist = document.querySelector('#dash-stat-watchlist');
  const statRating = document.querySelector('#dash-stat-rating');

  const localWatched = userMovieService.getWatched();
  const localFavs = userMovieService.getFavorites();
  const localWatchlist = userMovieService.getWatchlist();
  const localRatings = userMovieService.getRatings();

  const avgScore = localRatings.length > 0
    ? (localRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / localRatings.length).toFixed(1)
    : 0;

  if (statWatched) statWatched.textContent = localWatched.length;
  if (statFavorites) statFavorites.textContent = localFavs.length;
  if (statWatchlist) statWatchlist.textContent = localWatchlist.length;
  if (statRating) statRating.textContent = Number(avgScore) > 0 ? `${avgScore} ★` : 'NR';
}

/**
 * Load recently viewed movies
 */
function loadRecentlyViewed(mountEl) {
  const recentMovies = userMovieService.getRecentlyViewed();
  if (mountEl) {
    mountEl.innerHTML = '';
    if (recentMovies.length > 0) {
      mountEl.appendChild(
        createMovieCarousel(recentMovies, { title: 'Recently Viewed' })
      );
    } else {
      const sec = document.querySelector('#recent-section');
      if (sec) sec.style.display = 'none';
    }
  }
}

/**
 * Load personalized recommendations with error handling
 */
async function loadPersonalizedRecommendations(mountEl, reasonEl) {
  try {
    const recs = await recommendationService.getPersonalizedRecommendations();
    if (mountEl && recs.movies && recs.movies.length > 0) {
      mountEl.innerHTML = '';
      if (reasonEl && recs.reason) {
        reasonEl.textContent = recs.reason;
      }
      mountEl.appendChild(
        createMovieCarousel(recs.movies, { title: 'Recommended For You' })
      );
    }
  } catch (error) {
    console.warn('[Dashboard] Recommendations failed:', error);
    if (mountEl) {
      mountEl.innerHTML = '';
      if (reasonEl) {
        reasonEl.textContent = 'Curated selection';
      }
    }
  }
}

/**
 * Load watchlist preview
 */
function loadWatchlistPreview(mountEl) {
  const watchlistMovies = userMovieService.getWatchlist();
  if (mountEl) {
    mountEl.innerHTML = '';
    if (watchlistMovies.length > 0) {
      mountEl.appendChild(
        createMovieCarousel(watchlistMovies.slice(0, 16), { title: 'My Watchlist' })
      );
    } else {
      mountEl.appendChild(
        createEmptyState({
          icon: 'bookmark',
          title: 'Your Watchlist is empty',
          description: 'Save movies you plan to watch to see them here.',
          actionText: 'Discover Movies',
          actionHref: 'search.html'
        })
      );
    }
  }
}

/**
 * Load favorites preview
 */
function loadFavoritesPreview(mountEl) {
  const favoriteMovies = userMovieService.getFavorites();
  if (mountEl) {
    mountEl.innerHTML = '';
    if (favoriteMovies.length > 0) {
      mountEl.appendChild(
        createMovieCarousel(favoriteMovies.slice(0, 16), { title: 'My Favorites' })
      );
    } else {
      mountEl.appendChild(
        createEmptyState({
          icon: 'heart',
          title: 'No Favorites Yet',
          description: 'Add movies to your favorites by tapping the heart icon.',
          actionText: 'Explore Trending',
          actionHref: 'index.html'
        })
      );
    }
  }
}

/**
 * Load genre analytics breakdown
 */
async function loadGenreAnalytics(mountEl) {
  if (!mountEl) return;

  try {
    const genreMap = await getGenreMap();
    const genreCounts = {};

    const localWatched = userMovieService.getWatched();
    const localFavs = userMovieService.getFavorites();
    const localWatchlist = userMovieService.getWatchlist();

    [...localFavs, ...localWatched, ...localWatchlist].forEach(m => {
      const gids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
      gids.forEach(gid => {
        genreCounts[gid] = (genreCounts[gid] || 0) + 1;
      });
    });

    renderGenreAnalytics(mountEl, genreCounts, genreMap);
  } catch (error) {
    console.error('[Dashboard] Genre analytics error:', error);
    mountEl.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); padding: 0.5rem 0;">Unable to load genre breakdown.</p>`;
  }
}

async function renderGenreAnalytics(container, genreCounts, preloadedMap = null) {
  const genreMap = preloadedMap || (await getGenreMap());
  const entries = Object.entries(genreCounts);

  if (entries.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); padding: 0.5rem 0;">Rate or favorite movies to see your personalized genre breakdown.</p>`;
    return;
  }

  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = sorted[0][1] || 1;

  container.innerHTML = sorted.map(([gid, count]) => {
    const genreName = genreMap.get(Number(gid)) || 'Cinema';
    const percent = Math.round((count / maxCount) * 100);

    return `
      <div class="genre-bar-row">
        <div class="genre-bar-header">
          <span>${genreName}</span>
          <span>${count} ${count === 1 ? 'title' : 'titles'}</span>
        </div>
        <div class="genre-bar-track">
          <div class="genre-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}
