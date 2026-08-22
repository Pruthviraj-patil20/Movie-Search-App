/**
 * Personalized Dashboard Page Controller
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

  // Insert Skeletons
  if (recentMount) recentMount.innerHTML = skeleton.carousel();
  if (recsMount) recsMount.innerHTML = skeleton.carousel();
  if (watchlistMount) watchlistMount.innerHTML = skeleton.carousel();
  if (favoritesMount) favoritesMount.innerHTML = skeleton.carousel();

  loader.start();

  try {
    // 1. Calculate & Render Stats
    if (isAuth) {
      analyticsService.getUserStats().then(stats => {
        if (statWatched) statWatched.textContent = stats.totalWatched;
        if (statFavorites) statFavorites.textContent = stats.totalFavorites;
        if (statWatchlist) statWatchlist.textContent = stats.totalWatchlist;
        if (statRating) statRating.textContent = stats.averageRating > 0 ? `${stats.averageRating} ★` : 'NR';

        if (genreAnalyticsMount && stats.genreCounts) {
          renderGenreAnalytics(genreAnalyticsMount, stats.genreCounts);
        }
      });
    } else {
      // Local Guest Stats Calculation
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

      // Local Genre Breakdown
      const genreCounts = {};
      [...localFavs, ...localWatched, ...localWatchlist].forEach(m => {
        const gids = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
        gids.forEach(gid => {
          genreCounts[gid] = (genreCounts[gid] || 0) + 1;
        });
      });

      if (genreAnalyticsMount) {
        renderGenreAnalytics(genreAnalyticsMount, genreCounts);
      }
    }

    // 2. Load Recently Viewed & Continue Watching
    const recentMovies = userMovieService.getRecentlyViewed();
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
    const watchlistMovies = userMovieService.getWatchlist();
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
    const favoriteMovies = userMovieService.getFavorites();
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
