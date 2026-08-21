/**
 * Personalized Dashboard Page Controller
 */

import { getGenreMap } from '../api/genres.js';
import { requireAuth } from '../components/authGuard.js';
import { createMovieCarousel } from '../components/carousel.js';
import { createEmptyState } from '../components/emptyState.js';
import { loader } from '../components/loader.js';
import { skeleton } from '../components/skeleton.js';
import { analyticsService } from '../services/analyticsService.js';
import { authService } from '../services/authService.js';
import { recommendationService } from '../services/recommendationService.js';
import { userMovieService } from '../services/userMovieService.js';

export async function initDashboardPage() {
  const isAuth = await requireAuth();
  if (!isAuth) return;

  const user = authService.getUser();
  if (!user) return;

  // Header Elements
  const greetingEl = document.querySelector('#dashboard-user-name');
  if (greetingEl) greetingEl.textContent = user.name.split(' ')[0];

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

  // Insert Skeletons
  if (recentMount) recentMount.innerHTML = skeleton.carousel();
  if (recsMount) recsMount.innerHTML = skeleton.carousel();
  if (watchlistMount) watchlistMount.innerHTML = skeleton.carousel();
  if (favoritesMount) favoritesMount.innerHTML = skeleton.carousel();

  loader.start();

  try {
    // 1. Fetch User Stats
    analyticsService.getUserStats().then(stats => {
      if (statWatched) statWatched.textContent = stats.totalWatched;
      if (statFavorites) statFavorites.textContent = stats.totalFavorites;
      if (statWatchlist) statWatchlist.textContent = stats.totalWatchlist;
      if (statRating) statRating.textContent = stats.averageRating > 0 ? `${stats.averageRating} ★` : 'NR';

      // Render Genre Preferences Breakdown
      if (genreAnalyticsMount && stats.genreCounts) {
        renderGenreAnalytics(genreAnalyticsMount, stats.genreCounts);
      }
    });

    // 2. Load Recently Viewed & Continue Watching
    const recentMovies = await userMovieService.getRecentlyViewed();
    if (recentMount) {
      recentMount.innerHTML = '';
      if (recentMovies.length > 0) {
        recentMount.appendChild(
          createMovieCarousel(recentMovies, { title: 'Recently Viewed' })
        );
      } else {
        const sec = document.querySelector('#recent-section');
        if (sec) sec.style.display = 'none';
      }
    }

    // 3. Load Personalized Recommendations
    recommendationService.getPersonalizedRecommendations().then(recs => {
      if (recsMount && recs.movies && recs.movies.length > 0) {
        recsMount.innerHTML = '';
        if (recsReasonEl && recs.reason) {
          recsReasonEl.textContent = recs.reason;
        }
        recsMount.appendChild(
          createMovieCarousel(recs.movies, { title: 'Recommended For You' })
        );
      }
    });

    // 4. Load Watchlist
    const watchlistMovies = await userMovieService.getWatchlist();
    if (watchlistMount) {
      watchlistMount.innerHTML = '';
      if (watchlistMovies.length > 0) {
        watchlistMount.appendChild(
          createMovieCarousel(watchlistMovies.slice(0, 16), { title: 'My Watchlist' })
        );
      } else {
        watchlistMount.appendChild(
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

    // 5. Load Favorites
    const favoriteMovies = await userMovieService.getFavorites();
    if (favoritesMount) {
      favoritesMount.innerHTML = '';
      if (favoriteMovies.length > 0) {
        favoritesMount.appendChild(
          createMovieCarousel(favoriteMovies.slice(0, 16), { title: 'My Favorites' })
        );
      } else {
        favoritesMount.appendChild(
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

  } catch (error) {
    console.error('[Dashboard] Error rendering dashboard:', error);
  } finally {
    loader.done();
  }
}

async function renderGenreAnalytics(container, genreCounts) {
  const genreMap = await getGenreMap();
  const entries = Object.entries(genreCounts);

  if (entries.length === 0) {
    container.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Watch and rate more movies to see your personalized genre breakdown.</p>`;
    return;
  }

  const sorted = entries.sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = sorted[0][1] || 1;

  container.innerHTML = sorted.map(([gid, count]) => {
    const genreName = genreMap.get(Number(gid)) || 'Genre';
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
