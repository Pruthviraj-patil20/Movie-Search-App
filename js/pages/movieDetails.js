/**
 * Movie Details Page Controller with Multi-User Watched & Rating Actions
 */

import { CONFIG } from '../config.js';
import { getMovieDetails, getRecommendations, getSimilarMovies } from '../api/movies.js';
import { getOmdbMovieDetails } from '../api/omdb.js';
import { createMovieCarousel } from '../components/carousel.js';
import { loader } from '../components/loader.js';
import { modal } from '../components/modal.js';
import { ratingModal } from '../components/ratingModal.js';
import { skeleton } from '../components/skeleton.js';
import { toast } from '../components/toast.js';
import { favoriteService } from '../services/favoriteService.js';
import { userMovieService, USER_MOVIES_EVENT } from '../services/userMovieService.js';
import { watchlistService } from '../services/watchlistService.js';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRating,
  formatRuntime,
  formatYear
} from '../utils/formatters.js';
import { getBackdropUrl, getImageUrl, onEvent } from '../utils/helpers.js';
import { getActorProfile } from '../data/actorProfiles.js';
import { getUrlParam } from '../utils/urlParams.js';
import { isValidMovieId } from '../utils/validators.js';

export async function initMovieDetailsPage() {
  const mountEl = document.querySelector('#movie-details-mount');
  const castMount = document.querySelector('#cast-slider-mount');
  const similarMount = document.querySelector('#similar-carousel-mount');
  const recsMount = document.querySelector('#recommendations-carousel-mount');

  const movieId = getUrlParam('id');

  if (!isValidMovieId(movieId)) {
    window.location.href = '404.html';
    return;
  }

  if (mountEl) mountEl.innerHTML = skeleton.details();
  loader.start();

  try {
    const movie = await getMovieDetails(movieId);

    if (!movie || !movie.id) {
      window.location.href = '404.html';
      return;
    }

    // Set Document Title
    document.title = `${movie.title} (${formatYear(movie.release_date)}) - CineSphere`;

    // Track in recently viewed
    userMovieService.addRecentlyViewed(movie);

    // 1. Render Main Showcase Details
    const omdb = await renderShowcase(mountEl, movie);

    // 2. Render Cast Members Slider
    if (castMount) {
      renderCast(castMount, movie, omdb);
    }

    // 3. Render Similar Movies Carousel
    if (similarMount) {
      const similarData = await getSimilarMovies(movie.id);
      const similarMovies = similarData.results || [];
      if (similarMovies.length > 0) {
        similarMount.innerHTML = '';
        similarMount.appendChild(
          createMovieCarousel(similarMovies.slice(0, 16), { title: 'Similar Movies' })
        );
      } else {
        const sec = document.querySelector('#similar-section');
        if (sec) sec.style.display = 'none';
      }
    }

    // 4. Render Recommended Movies Carousel
    if (recsMount) {
      const recsData = await getRecommendations(movie.id);
      const recMovies = recsData.results || [];
      if (recMovies.length > 0) {
        recsMount.innerHTML = '';
        recsMount.appendChild(
          createMovieCarousel(recMovies.slice(0, 16), { title: 'Recommended Movies' })
        );
      } else {
        const sec = document.querySelector('#recommendations-section');
        if (sec) sec.style.display = 'none';
      }
    }

  } catch (error) {
    console.error('[MovieDetailsPage] Error rendering movie details:', error);
    if (mountEl) {
      mountEl.innerHTML = `
        <div class="container section" style="padding-top: 5rem; text-align: center;">
          <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Failed to load movie details</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Please check your connection or return to home.</p>
          <a href="index.html" class="btn btn-primary">Back to Home</a>
        </div>
      `;
    }
  } finally {
    loader.done();
  }
}

async function renderShowcase(container, movie) {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, CONFIG.IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(movie.poster_path, CONFIG.IMAGE_SIZES.POSTER_LARGE);
  const title = movie.title || 'Untitled';
  const year = formatYear(movie.release_date);
  const rating = formatRating(movie.vote_average);
  const votes = formatNumber(movie.vote_count);
  const runtime = formatRuntime(movie.runtime);
  const releaseDate = formatDate(movie.release_date);
  const budget = formatCurrency(movie.budget);
  const revenue = formatCurrency(movie.revenue);
  const status = movie.status || 'Released';
  const originalLanguage = (movie.original_language || 'en').toUpperCase();
  const companies = (movie.production_companies || []).map(c => c.name).join(', ') || 'Independent';

  const [isWatch, isFav, isWatched, userRating, omdb] = await Promise.all([
    watchlistService.isInWatchlist(movie.id),
    favoriteService.isFavorite(movie.id),
    userMovieService.isWatched(movie.id),
    userMovieService.getMovieRating(movie.id),
    getOmdbMovieDetails({ title: movie.title, year: formatYear(movie.release_date), imdbId: movie.imdb_id })
  ]);

  // Genre pills HTML
  const genresHtml = (movie.genres || [])
    .map(g => `<a href="search.html?genre=${g.id}" class="genre-tag">${g.name}</a>`)
    .join('');

  // OMDb Badges HTML
  let omdbBadgesHtml = '';
  if (omdb) {
    const badges = [];
    if (omdb.imdbRating) {
      badges.push(`
        <div class="omdb-badge omdb-badge-imdb" title="IMDb Rating (${omdb.imdbVotes || ''} votes)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>IMDb ${omdb.imdbRating}/10</span>
        </div>
      `);
    }
    if (omdb.rottenTomatoes) {
      badges.push(`
        <div class="omdb-badge omdb-badge-tomato" title="Rotten Tomatoes Score">
          <span>🍅 ${omdb.rottenTomatoes} Rotten Tomatoes</span>
        </div>
      `);
    }
    if (omdb.metascore) {
      badges.push(`
        <div class="omdb-badge omdb-badge-metascore" title="Metacritic Metascore">
          <span>Metascore ${omdb.metascore}/100</span>
        </div>
      `);
    }
    if (badges.length > 0) {
      omdbBadgesHtml = `<div class="omdb-ratings-row">${badges.join('')}</div>`;
    }
  }

  // OMDb Awards HTML
  let omdbAwardsHtml = '';
  if (omdb && omdb.awards && omdb.awards !== 'N/A') {
    omdbAwardsHtml = `
      <div class="omdb-awards-box">
        <span class="omdb-awards-icon">🏆</span>
        <span>${omdb.awards}</span>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="movie-details-hero">
      <div class="details-backdrop" style="background-image: url('${backdropUrl}');"></div>
      <div class="details-overlay"></div>

      <div class="details-container">
        <!-- Left: Poster -->
        <div class="details-poster-wrap">
          <img 
            src="${posterUrl}" 
            alt="${title} Poster" 
            class="details-poster-img"
            onerror="this.onerror=null;this.src='${CONFIG.FALLBACK_POSTER}'"
          />
        </div>

        <!-- Right: Info -->
        <div class="details-info">
          <nav class="details-breadcrumbs" aria-label="Breadcrumb">
            <a href="index.html">Home</a>
            <span>/</span>
            <a href="search.html">Movies</a>
            <span>/</span>
            <span style="color: var(--text-primary);">${title}</span>
          </nav>

          <div class="details-title-wrap">
            <h1 class="details-title">${title}</h1>
            ${movie.tagline ? `<p class="details-tagline">“${movie.tagline}”</p>` : ''}
          </div>

          <div class="details-metrics-row">
            <div class="metric-item metric-star-score" title="TMDB Rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <strong>${rating}</strong>
              <span style="color: var(--text-muted); font-size: 0.8rem;">(${votes} votes)</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${runtime}</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>${releaseDate}</span>
            </div>

            <div class="hero-dot-separator"></div>

            <div class="metric-item">
              <span class="badge badge-outline">${status}</span>
            </div>
          </div>

          ${omdbBadgesHtml}

          <div class="details-genres">
            ${genresHtml}
          </div>

          <div class="details-actions-bar">
            <button type="button" class="btn btn-primary btn-watch-movie" id="details-watch-movie">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>Watch Movie</span>
            </button>

            <button type="button" class="btn btn-secondary" id="details-play-trailer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Trailer
            </button>

            <button type="button" class="btn btn-secondary ${isWatch ? 'active' : ''}" id="details-watchlist-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWatch ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span id="details-watchlist-label">${isWatch ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <button type="button" class="btn btn-secondary ${isFav ? 'active' : ''}" id="details-favorite-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span id="details-fav-label">${isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button type="button" class="btn btn-secondary ${isWatched ? 'active' : ''}" id="details-watched-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span id="details-watched-label">${isWatched ? 'Watched' : 'Mark Watched'}</span>
            </button>

            <button type="button" class="btn btn-secondary" id="details-rate-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${userRating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold);">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span id="details-rate-label">${userRating ? `Rated ${userRating}/10` : 'Rate Movie'}</span>
            </button>

            <button type="button" class="btn btn-glass btn-icon" id="details-share-btn" title="Share Movie" aria-label="Share movie link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>

          ${omdbAwardsHtml}

          <div class="details-overview-section">
            <h3 class="details-section-heading">Overview</h3>
            <p class="details-overview-text">${movie.overview || (omdb && omdb.plot) || 'No overview has been provided for this title.'}</p>
          </div>

          <div class="details-meta-grid">
            <div class="meta-block">
              <span class="meta-label">Original Language</span>
              <span class="meta-value">${originalLanguage}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Budget</span>
              <span class="meta-value">${budget}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Box Office</span>
              <span class="meta-value">${(omdb && omdb.boxOffice) ? omdb.boxOffice : revenue}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Production</span>
              <span class="meta-value" title="${companies}">${companies}</span>
            </div>
            ${(omdb && omdb.director && omdb.director !== 'N/A') ? `
              <div class="meta-block">
                <span class="meta-label">Director</span>
                <span class="meta-value">${omdb.director}</span>
              </div>
            ` : ''}
            ${(omdb && omdb.writer && omdb.writer !== 'N/A') ? `
              <div class="meta-block">
                <span class="meta-label">Writer</span>
                <span class="meta-value" title="${omdb.writer}">${omdb.writer.split(',')[0]}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Handlers
  const watchMovieBtn = container.querySelector('#details-watch-movie');
  if (watchMovieBtn) {
    watchMovieBtn.addEventListener('click', () => {
      modal.openWatchMovie(movie.id, title, movie);
    });
  }

  const trailerBtn = container.querySelector('#details-play-trailer');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      modal.openTrailer(movie.id, title);
    });
  }

  // Watchlist Toggle
  const watchBtn = container.querySelector('#details-watchlist-btn');
  const watchLabel = container.querySelector('#details-watchlist-label');
  watchBtn.addEventListener('click', async () => {
    const added = await watchlistService.toggleWatchlist(movie);
    watchBtn.classList.toggle('active', added);
    watchLabel.textContent = added ? 'In Watchlist' : 'Add to Watchlist';
    const svg = watchBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Watchlist`);
    } else {
      toast.info(`"${title}" removed from Watchlist`);
    }
  });

  // Favorite Toggle
  const favBtn = container.querySelector('#details-favorite-btn');
  const favLabel = container.querySelector('#details-fav-label');
  favBtn.addEventListener('click', async () => {
    const added = await favoriteService.toggleFavorite(movie);
    favBtn.classList.toggle('active', added);
    favLabel.textContent = added ? 'Favorited' : 'Favorite';
    const svg = favBtn.querySelector('svg');
    svg.setAttribute('fill', added ? 'currentColor' : 'none');

    if (added) {
      toast.success(`"${title}" added to Favorites`);
    } else {
      toast.info(`"${title}" removed from Favorites`);
    }
  });

  // Watched Toggle
  const watchedBtn = container.querySelector('#details-watched-btn');
  const watchedLabel = container.querySelector('#details-watched-label');
  watchedBtn.addEventListener('click', async () => {
    const currentlyWatched = await userMovieService.isWatched(movie.id);
    if (currentlyWatched) {
      await userMovieService.removeFromWatched(movie.id);
      watchedBtn.classList.remove('active');
      watchedLabel.textContent = 'Mark Watched';
      toast.info(`Removed "${title}" from watched history`);
    } else {
      await userMovieService.markAsWatched(movie);
      watchedBtn.classList.add('active');
      watchedLabel.textContent = 'Watched';
      toast.success(`Marked "${title}" as watched!`);
    }
  });

  // Rate Movie Button -> Modal
  const rateBtn = container.querySelector('#details-rate-btn');
  const rateLabel = container.querySelector('#details-rate-label');
  rateBtn.addEventListener('click', () => {
    ratingModal.open(movie);
  });

  onEvent(USER_MOVIES_EVENT, (e) => {
    if (e.detail.type === 'rating' && e.detail.movieId === movie.id) {
      const score = e.detail.rating;
      rateLabel.textContent = score ? `Rated ${score}/10` : 'Rate Movie';
      const svg = rateBtn.querySelector('svg');
      svg.setAttribute('fill', score ? 'currentColor' : 'none');
    }
  });

  // Share Button
  const shareBtn = container.querySelector('#details-share-btn');
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: `${title} - CineSphere`,
      text: `Check out ${title} on CineSphere!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Movie link copied to clipboard!');
    } catch (err) {
      toast.info('Could not copy link.');
    }
  });

  return omdb;
}

const CURATED_CAST_MAP = {
  999108: [
    { name: "Yash", character: "Lead / Underworld Kingpin" },
    { name: "Kiara Advani", character: "Lead Protagonist" },
    { name: "Nayanthara", character: "Crucial Lead" },
    { name: "Huma Qureshi", character: "Underworld Queen" },
    { name: "Tara Sutaria", character: "Key Role" },
    { name: "Shruti Haasan", character: "Special Appearance" }
  ],
  511819: [
    { name: "Yash", character: "Rocky Bhai" },
    { name: "Sanjay Dutt", character: "Adheera" },
    { name: "Raveena Tandon", character: "Ramika Sen" },
    { name: "Srinidhi Shetty", character: "Reena Desai" },
    { name: "Prakash Raj", character: "Vijayendra Ingalagi" }
  ],
  489999: [
    { name: "Yash", character: "Raja Krishnappa Bairya / Rocky" },
    { name: "Srinidhi Shetty", character: "Reena" },
    { name: "Anant Nag", character: "Anand Ingalagi" },
    { name: "Ramachandra Raju", character: "Garuda" }
  ],
  1018597: [
    { name: "Rishab Shetty", character: "Kaadubettu Shiva" },
    { name: "Sapthami Gowda", character: "Leela" },
    { name: "Kishore", character: "Muralidhar" },
    { name: "Achyuth Kumar", character: "Devendra Suttooru" }
  ],
  791402: [
    { name: "Rakshit Shetty", character: "Dharma" },
    { name: "Sangeetha Sringeri", character: "Devika" },
    { name: "Raj B. Shetty", character: "Dr. Ashwin Kumar" },
    { name: "Danish Sait", character: "Karshan Roy" }
  ],
  618451: [
    { name: "Kichcha Sudeep", character: "Vikrant Rona" },
    { name: "Nirup Bhandari", character: "Sanjeev Gambhira" },
    { name: "Neetha Ashok", character: "Aparna Ballal" },
    { name: "Jacqueline Fernandez", character: "Gadang Rakkamma" }
  ],
  111125: [
    { name: "Rakshit Shetty", character: "Manu" },
    { name: "Rukmini Vasanth", character: "Priya" },
    { name: "Chaithra J. Achar", character: "Surabhi" },
    { name: "Achyuth Kumar", character: "Prabhu" }
  ],
  999101: [
    { name: "Sam Worthington", character: "Jake Sully" },
    { name: "Zoe Saldaña", character: "Neytiri" },
    { name: "Sigourney Weaver", character: "Kiri" },
    { name: "Stephen Lang", character: "Miles Quaritch" }
  ],
  999102: [
    { name: "David Corenswet", character: "Clark Kent / Superman" },
    { name: "Rachel Brosnahan", character: "Lois Lane" },
    { name: "Nicholas Hoult", character: "Lex Luthor" },
    { name: "Edi Gathegi", character: "Mister Terrific" }
  ],
  999103: [
    { name: "Tom Cruise", character: "Ethan Hunt" },
    { name: "Hayley Atwell", character: "Grace" },
    { name: "Ving Rhames", character: "Luther Stickell" },
    { name: "Simon Pegg", character: "Benji Dunn" }
  ],
  999104: [
    { name: "Hrithik Roshan", character: "Major Kabir Dhaliwal" },
    { name: "Jr. NTR", character: "Agent Vikram" },
    { name: "Kiara Advani", character: "Lead Female" }
  ],
  999105: [
    { name: "Robert Pattinson", character: "Bruce Wayne / Batman" },
    { name: "Colin Farrell", character: "Oswald Cobblepot / Penguin" },
    { name: "Jeffrey Wright", character: "Jim Gordon" }
  ],
  999106: [
    { name: "Robert Downey Jr.", character: "Victor Von Doom / Doctor Doom" },
    { name: "Pedro Pascal", character: "Reed Richards / Mr. Fantastic" },
    { name: "Vanessa Kirby", character: "Sue Storm" },
    { name: "Anthony Mackie", character: "Captain America" }
  ],
  999107: [
    { name: "Rishab Shetty", character: "Ancient Forest Warrior" },
    { name: "Sapthami Gowda", character: "Goddess Priestess" }
  ],
  999109: [
    { name: "Salman Khan", character: "Sikandar" },
    { name: "Rashmika Mandanna", character: "Lead Role" },
    { name: "Sathyaraj", character: "Antagonist" }
  ]
};

function renderCast(container, movieOrCast, omdb) {
  let castList = [];
  const movie = (typeof movieOrCast === 'object' && movieOrCast.title) ? movieOrCast : null;

  if (movie) {
    const titleLower = (movie.title || '').toLowerCase();
    if (CURATED_CAST_MAP[movie.id]) {
      castList = CURATED_CAST_MAP[movie.id];
    } else if (titleLower.includes('toxic')) {
      castList = CURATED_CAST_MAP[999108];
    } else if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && movie.credits.cast[0].name !== 'Lead Performer') {
      castList = movie.credits.cast.slice(0, 15);
    } else if (omdb && omdb.actors && omdb.actors !== 'N/A') {
      castList = omdb.actors.split(',').map((name, idx) => ({
        name: name.trim(),
        character: idx === 0 ? 'Lead Performer' : 'Key Role'
      }));
    }
  } else if (Array.isArray(movieOrCast)) {
    castList = movieOrCast;
  }

  if (!castList || castList.length === 0) {
    const sec = document.querySelector('#cast-section');
    if (sec) sec.style.display = 'none';
    return;
  }

  const sec = document.querySelector('#cast-section');
  if (sec) sec.style.display = 'block';

  container.innerHTML = '';
  const slider = document.createElement('div');
  slider.className = 'cast-slider';

  castList.forEach(member => {
    const name = member.name || 'Cast Member';
    const cleanName = encodeURIComponent(name.trim());
    const initialsAvatar = `https://ui-avatars.com/api/?name=${cleanName}&background=1e293b&color=38bdf8&size=200&bold=true&font-size=0.4`;

    let photoUrl = initialsAvatar;
    const verifiedProfile = getActorProfile(member.name);

    if (verifiedProfile) {
      photoUrl = verifiedProfile;
    } else if (member.profile_path) {
      if (member.profile_path.startsWith('http://') || member.profile_path.startsWith('https://')) {
        // Only use external URL if not an unverified generic unsplash photo
        if (!member.profile_path.includes('images.unsplash.com')) {
          photoUrl = member.profile_path;
        }
      } else {
        photoUrl = `${CONFIG.IMAGE_BASE_URL}${CONFIG.IMAGE_SIZES.PROFILE_MEDIUM}${member.profile_path}`;
      }
    }

    const card = document.createElement('div');
    card.className = 'cast-card';
    card.innerHTML = `
      <div class="cast-photo-wrap">
        <img src="${photoUrl}" alt="${name}" class="cast-photo" loading="lazy" />
      </div>
      <span class="cast-name">${name}</span>
      <span class="cast-character">${member.character || 'Cast'}</span>
    `;

    const img = card.querySelector('.cast-photo');
    let hasTriedWiki = false;

    img.addEventListener('error', async () => {
      // If photo fails and we haven't tried dynamic Wikipedia lookup, try once
      if (!hasTriedWiki && name && name !== 'Cast Member') {
        hasTriedWiki = true;
        try {
          const wikiQuery = name.trim().replace(/ /g, '_');
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiQuery)}`);
          const data = await res.json();
          const dynamicSrc = data.thumbnail?.source || data.originalimage?.source;
          if (dynamicSrc) {
            img.src = dynamicSrc;
            return;
          }
        } catch (err) {
          // Fall through to initials avatar
        }
      }
      img.onerror = null;
      img.src = initialsAvatar;
    });

    slider.appendChild(card);
  });

  container.appendChild(slider);
}
