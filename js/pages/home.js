/**
 * Home Page Controller
 * Manages Hero, Trending (Day/Week), Popular, Top Rated, Upcoming, and Genre discovery
 */

import { CATEGORY_DATA } from './category.js';
import { getMovieGenres } from '../api/genres.js';
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies
} from '../api/movies.js';
import { createMovieCarousel } from '../components/carousel.js';
import { renderHeroBanner } from '../components/hero.js';
import { renderBollywoodBanner } from '../components/bollywoodBanner.js';
import { loader } from '../components/loader.js';
import { skeleton } from '../components/skeleton.js';

// Genre icon map helper
const GENRE_ICONS = {
  Action: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  Adventure: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  Animation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  Comedy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  Crime: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  Documentary: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
  Drama: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  Family: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  Fantasy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  Horror: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  Mystery: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  Romance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  "Sci-Fi": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>`,
  Thriller: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
};

export async function initHomePage() {
  const heroMount = document.querySelector('#hero-mount');
  const trendingMount = document.querySelector('#trending-carousel-mount');
  const popularMount = document.querySelector('#popular-carousel-mount');
  const topRatedMount = document.querySelector('#top-rated-carousel-mount');
  const hindiBannerMount = document.querySelector('#hindi-banner-mount');
  const hindiMount = document.querySelector('#hindi-carousel-mount');
  const tamilBannerMount = document.querySelector('#tamil-banner-mount');
  const tamilMount = document.querySelector('#tamil-carousel-mount');
  const marathiBannerMount = document.querySelector('#marathi-banner-mount');
  const marathiMount = document.querySelector('#marathi-carousel-mount');
  const teluguMount = document.querySelector('#telugu-carousel-mount');
  const malayalamMount = document.querySelector('#malayalam-carousel-mount');
  const kannadaMount = document.querySelector('#kannada-carousel-mount');
  const koreanMount = document.querySelector('#korean-carousel-mount');
  const japaneseMount = document.querySelector('#japanese-carousel-mount');
  const upcomingMount = document.querySelector('#upcoming-carousel-mount');
  const genresMount = document.querySelector('#genres-grid-mount');

  // Insert Skeletons immediately
  if (heroMount) heroMount.innerHTML = skeleton.hero();
  if (trendingMount) trendingMount.innerHTML = skeleton.carousel();
  if (popularMount) popularMount.innerHTML = skeleton.carousel();
  if (topRatedMount) topRatedMount.innerHTML = skeleton.carousel();
  if (hindiBannerMount) hindiBannerMount.innerHTML = `<div class="skeleton" style="height: 480px; border-radius: 24px; margin-bottom: 2rem;"></div>`;
  if (tamilBannerMount) tamilBannerMount.innerHTML = `<div class="skeleton" style="height: 480px; border-radius: 24px; margin-bottom: 2rem;"></div>`;
  if (marathiBannerMount) marathiBannerMount.innerHTML = `<div class="skeleton" style="height: 480px; border-radius: 24px; margin-bottom: 2rem;"></div>`;
  if (hindiMount) hindiMount.innerHTML = skeleton.carousel();
  if (tamilMount) tamilMount.innerHTML = skeleton.carousel();
  if (marathiMount) marathiMount.innerHTML = skeleton.carousel();
  if (teluguMount) teluguMount.innerHTML = skeleton.carousel();
  if (malayalamMount) malayalamMount.innerHTML = skeleton.carousel();
  if (kannadaMount) kannadaMount.innerHTML = skeleton.carousel();
  if (koreanMount) koreanMount.innerHTML = skeleton.carousel();
  if (japaneseMount) japaneseMount.innerHTML = skeleton.carousel();
  if (upcomingMount) upcomingMount.innerHTML = skeleton.carousel();

  loader.start();

  try {
    // 1. Fetch Trending Movies for Hero & Trending Carousel
    const trendingData = await getTrendingMovies('day');
    const trendingMovies = trendingData.results || [];

    if (trendingMovies.length > 0) {
      // Hero Spotlight
      if (heroMount) {
        renderHeroBanner(heroMount, trendingMovies[0]);
      }

      // Trending Carousel
      if (trendingMount) {
        trendingMount.innerHTML = '';
        trendingMount.appendChild(
          createMovieCarousel(trendingMovies.slice(0, 16), { title: 'Trending Today' })
        );
      }
    }

    // 2. Setup Trending Day / Week Toggle
    const toggleBtns = document.querySelectorAll('.trending-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const windowType = btn.getAttribute('data-window');
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (trendingMount) {
          trendingMount.innerHTML = skeleton.carousel();
          const refreshed = await getTrendingMovies(windowType);
          trendingMount.innerHTML = '';
          trendingMount.appendChild(
            createMovieCarousel(refreshed.results || [], { title: `Trending ${windowType}` })
          );
        }
      });
    });

    // 3. Fetch Popular Movies
    getPopularMovies(1).then(data => {
      if (popularMount) {
        popularMount.innerHTML = '';
        popularMount.appendChild(
          createMovieCarousel(data.results || [], { title: 'Popular Movies' })
        );
      }
    });

    // 4. Fetch Top Rated Movies
    getTopRatedMovies(1).then(data => {
      if (topRatedMount) {
        topRatedMount.innerHTML = '';
        topRatedMount.appendChild(
          createMovieCarousel(data.results || [], { title: 'Top Rated Movies' })
        );
      }
    });

    // 5. Render Bollywood & Hindi Movies Banner + Carousel
    if (CATEGORY_DATA['hindi-movies']) {
      const hindiMovies = CATEGORY_DATA['hindi-movies'].movies;
      
      // Render Actual Featured Movie Banner for Bollywood & Classics
      if (hindiBannerMount) {
        hindiBannerMount.innerHTML = '';
        renderBollywoodBanner(hindiBannerMount, hindiMovies, {
          tagline: '🇮🇳 Bollywood & Classics Spotlight',
          languageLabel: 'Hindi • UHD',
          idPrefix: 'hindi',
          autoplayInterval: 8000
        });
      }

      // Render Carousel
      if (hindiMount) {
        hindiMount.innerHTML = '';
        hindiMount.appendChild(
          createMovieCarousel(hindiMovies, { title: 'Hindi Blockbusters & Masterpieces' })
        );
      }
    }

    // 6. Render Tamil Movies Spotlight Banner + Carousel
    if (CATEGORY_DATA['tamil-movies']) {
      const tamilMovies = CATEGORY_DATA['tamil-movies'].movies;

      // Render Spotlight Banner for Kollywood Blockbusters
      if (tamilBannerMount) {
        tamilBannerMount.innerHTML = '';
        renderBollywoodBanner(tamilBannerMount, tamilMovies, {
          tagline: '⚡ Kollywood Blockbusters Spotlight',
          languageLabel: 'Tamil • UHD',
          idPrefix: 'tamil',
          autoplayInterval: 8500
        });
      }

      // Render Carousel
      if (tamilMount) {
        tamilMount.innerHTML = '';
        tamilMount.appendChild(
          createMovieCarousel(tamilMovies, { title: 'Kollywood Action & Hits' })
        );
      }
    }

    // 7. Render Marathi Movies Spotlight Banner + Carousel
    if (CATEGORY_DATA['marathi-movies']) {
      const marathiMovies = CATEGORY_DATA['marathi-movies'].movies;

      // Render Spotlight Banner for Marathi Cinema Gems
      if (marathiBannerMount) {
        marathiBannerMount.innerHTML = '';
        renderBollywoodBanner(marathiBannerMount, marathiMovies, {
          tagline: '🚩 Marathi Cinema Gems Spotlight',
          languageLabel: 'Marathi • UHD',
          idPrefix: 'marathi',
          autoplayInterval: 9000
        });
      }

      // Render Carousel
      if (marathiMount) {
        marathiMount.innerHTML = '';
        marathiMount.appendChild(
          createMovieCarousel(marathiMovies, { title: 'Acclaimed Marathi Cinema' })
        );
      }
    }

    // 8. Render Telugu Movies Carousel
    if (CATEGORY_DATA['telugu-movies'] && teluguMount) {
      teluguMount.innerHTML = '';
      teluguMount.appendChild(
        createMovieCarousel(CATEGORY_DATA['telugu-movies'].movies, { title: 'Tollywood Action & Epics' })
      );
    }

    // 9. Render Malayalam Movies Carousel
    if (CATEGORY_DATA['malayalam-movies'] && malayalamMount) {
      malayalamMount.innerHTML = '';
      malayalamMount.appendChild(
        createMovieCarousel(CATEGORY_DATA['malayalam-movies'].movies, { title: 'Mollywood Stories & Masterpieces' })
      );
    }

    // 10. Render Kannada Movies Carousel
    if (CATEGORY_DATA['kannada-movies'] && kannadaMount) {
      kannadaMount.innerHTML = '';
      kannadaMount.appendChild(
        createMovieCarousel(CATEGORY_DATA['kannada-movies'].movies, { title: 'Sandalwood Cinematic Powerhouses' })
      );
    }

    // 11. Render Korean Movies Carousel
    if (CATEGORY_DATA['korean-movies'] && koreanMount) {
      koreanMount.innerHTML = '';
      koreanMount.appendChild(
        createMovieCarousel(CATEGORY_DATA['korean-movies'].movies, { title: 'K-Cinema Thrillers & Dramas' })
      );
    }

    // 12. Render Japanese & Anime Carousel
    if (CATEGORY_DATA['japanese-anime'] && japaneseMount) {
      japaneseMount.innerHTML = '';
      japaneseMount.appendChild(
        createMovieCarousel(CATEGORY_DATA['japanese-anime'].movies, { title: 'Anime & Iconic Japanese Films' })
      );
    }

    // 13. Fetch Upcoming Releases
    getUpcomingMovies(1).then(data => {
      if (upcomingMount) {
        upcomingMount.innerHTML = '';
        upcomingMount.appendChild(
          createMovieCarousel(data.results || [], { title: 'Upcoming Movies' })
        );
      }
    });

    // 14. Fetch & Render Genre Discovery Cards
    if (genresMount) {
      getMovieGenres().then(genres => {
        genresMount.innerHTML = '';
        const curatedGenres = genres.slice(0, 12);

        curatedGenres.forEach(genre => {
          const card = document.createElement('a');
          card.href = `search.html?genre=${genre.id}`;
          card.className = 'genre-card';

          const icon = GENRE_ICONS[genre.name] || `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;

          card.innerHTML = `
            <div class="genre-card-icon">${icon}</div>
            <span>${genre.name}</span>
          `;
          genresMount.appendChild(card);
        });
      });
    }

  } catch (error) {
    console.error('[HomePage] Error loading home sections:', error);
  } finally {
    loader.done();
  }
}
