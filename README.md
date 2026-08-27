# 🎬 CineSphere — Next-Gen Cinematic Movie Discovery App

<div align="center">

![CineSphere Banner](public/images/upcoming/upcoming_banner.jpg)

[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla%20%26%20Design%20Tokens-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![TMDB API](https://img.shields.io/badge/TMDB%20API-v3-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![OMDb API](https://img.shields.io/badge/OMDb%20API-Live%20IMDb%20%26%20Rotten%20Tomatoes-F5C518?style=for-the-badge&logo=imdb&logoColor=black)](https://www.omdbapi.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**CineSphere** is a modern, ultra-responsive, cinematic movie search and discovery web application. Built with pure Vanilla JavaScript (ES Modules), tailored CSS Design Tokens, Glassmorphism, and live API integrations with **TMDB** and **OMDb**.

[Explore Live Demo](#-getting-started) • [Key Features](#-features-overview) • [Multilingual Cinema](#-multilingual-cinema-catalog) • [Architecture](#-project-architecture) • [API Configuration](#-api-configuration)

</div>

---

## 🌟 Features Overview

### 1. 👑 Hero Spotlight & Multilingual Cinema Showcase
- **Cinematic Top Hero Banner**: Dynamic hero showcase featuring blockbusters like **Toxic: A Fairy Tale for Grown-ups** starring *Rocking Star Yash*, complete with authentic 4K backdrops, synopsis, and instant trailer playback.
- **Interactive Spotlight Carousels**: Dedicated spotlight banners for **Bollywood**, **Tamil**, **Marathi**, **Kannada**, **Telugu**, **Malayalam**, **Korean**, **Anime & Japanese**, **Spanish**, **Punjabi**, and **Bengali** cinema with interactive movie switcher pills.

### 2. 🚀 Upcoming Releases (2025 - 2026)
- Comprehensive showcase of upcoming theatrical blockbusters (*Avatar: Fire and Ash*, *Superman*, *Mission: Impossible - The Final Reckoning*, *War 2*, *The Batman: Part II*, *Avengers: Doomsday*, *Kantara: Chapter 1*, *Toxic*, *Sikandar*).
- Zero-latency local verified assets guarantee 100% reliable poster loading.

### 3. 🔍 Advanced Discovery & Live Search
- **Debounced Search**: Instant real-time search with zero UI lag.
- **Multi-Filter Engine**: Filter by Genre, Release Year, Minimum IMDb Rating, Language, and Multi-Criteria Sort (Popularity, Highest Rated, Newest Releases).
- **Search History & Live Suggestions**: Remembers recent search queries with one-click clearing and quick suggestions.

### 4. 🍅 OMDb & Live IMDb Ratings Integration
- Live API integration with **OMDb** (`1f6bb1be`) providing:
  - 🌟 **IMDb Score & Global Vote Count**
  - 🍅 **Rotten Tomatoes Tomatometer %**
  - 🟢 **Metacritic Metascore**
  - 🏆 **Academy Awards & International Nominations**
  - 💰 **Box Office Revenue & Director/Writer Info**

### 5. 🎭 Authentic Top Cast Profiles
- Sourced authentic portrait photographs for world-class actors (*Yash, Kiara Advani, Nayanthara, Huma Qureshi, Tara Sutaria, Leonardo DiCaprio, Cillian Murphy, Shah Rukh Khan, Prabhas, Allu Arjun, Mohanlal, Kamal Haasan, etc.*).
- Automatic smart fallback to high-resolution Wikipedia portraits with initials avatar backup.

### 6. 🎬 Video Trailer Modal & Watchlists
- **High-Definition Trailer Player**: Embedded YouTube modal player with zero-failure fallback trailer keys.
- **Client-Side Data Persistence**: Bookmark movies to **Watchlist** and **Favorites**, record **Watched History**, and rate films on a 1-10 scale via `localStorage`.

### 7. 🌓 Theme Engine & Glassmorphism UI
- **Dark & Light Mode**: Smooth transition between high-contrast cinematic Dark mode and clean Light mode with system theme detection.
- **Responsive Layout**: Designed for 4K desktop, tablet, and mobile with animated hamburger navigation drawer.

---

## 🏛️ Multilingual Cinema Catalog

CineSphere features 100+ curated movie titles across 11 major global & regional film industries:

| Industry | Region / Language | Featured Masterpieces |
| :--- | :--- | :--- |
| **Sandalwood** | 👑 Kannada | *Toxic (Yash)*, *K.G.F: Chapter 1 & 2*, *Kantara*, *777 Charlie*, *Vikrant Rona*, *Sapta Sagaradaache Ello* |
| **Tollywood** | 🏹 Telugu | *RRR*, *Pushpa 2: The Rule*, *Baahubali 2: The Conclusion*, *Kalki 2898 AD*, *Salaar*, *Devara*, *Hanu-Man* |
| **Mollywood** | 🌴 Malayalam | *Manjummel Boys*, *Premalu*, *Aavesham*, *Bramayugam*, *Drishyam 2*, *Lucifer*, *2018*, *Kumbalangi Nights* |
| **Kollywood** | ⚡ Tamil | *Leo*, *Jailer*, *Vikram*, *Ponniyin Selvan*, *Kaithi*, *Vikram Vedha*, *Master*, *Soorarai Pottru* |
| **Bollywood** | 🇮🇳 Hindi | *Dangal*, *3 Idiots*, *Sholay*, *Lagaan*, *DDLJ*, *Jawan*, *Pathaan*, *PK*, *Swades*, *Andhadhun* |
| **Marathi** | 🚩 Marathi | *Sairat*, *Natsamrat*, *Katyar Kaljat Ghusali*, *Baipan Bhaari Deva*, *Ved*, *Harishchandrachi Factory* |
| **K-Cinema** | 🇰🇷 Korean | *Parasite*, *Train to Busan*, *Past Lives*, *Decision to Leave*, *Oldboy*, *The Handmaiden* |
| **Anime & Japan** | ⛩️ Japanese | *Spirited Away*, *Your Name*, *Suzume*, *Princess Mononoke*, *Seven Samurai* |
| **Spanish Cinema** | 🇪🇸 Spanish | *Society of the Snow*, *Pan's Labyrinth*, *The Platform*, *The Invisible Guest* |
| **Pollywood** | 🪕 Punjabi | *Carry on Jatta 3*, *Jatt & Juliet 3*, *Chaar Sahibzaade* |
| **Tollywood East** | 🎭 Bengali | *Pather Panchali*, *Sonar Kella*, *Aparajito* |

---

## 🛠️ Tech Stack & Architecture

```
CineSphere (Pure Vanilla Web Application)
│
├── Frontend Core
│   ├── HTML5 (Semantic Structure, ARIA accessibility, SEO metadata)
│   ├── Vanilla CSS3 (Custom Design Tokens, Glassmorphism, Responsive Grid)
│   └── Modern JavaScript (ES6+ Modules, Async/Await, Web Components)
│
├── API Integrations
│   ├── TMDB API v3 (Movies, Trending, Genres, Credits, Recommendations)
│   └── OMDb API (Live IMDb ratings, Rotten Tomatoes %, Metascore, Awards)
│
├── Client-Side Persistence
│   └── LocalStorage (Watchlist, Favorites, User History, Star Ratings, Theme)
│
└── Tooling & Build
    └── Vite 6 (Lightning fast HMR dev server & Rollup production bundler)
```

---

## 📁 Project Directory Structure

```
Movie Search App/
├── index.html                   # Home page (Hero, Spotlight Banners, Multilingual Carousels)
├── search.html                  # Search & Discover page (Advanced Multi-Filter Engine)
├── movie.html                   # Movie Details view (Rotten Tomatoes/IMDb ratings, Cast, Trailer)
├── category.html                # Category Explorer (Interactive language & theme catalogs)
├── watchlist.html               # User Watchlist (LocalStorage persistence)
├── favorites.html               # User Favorites Collection
├── dashboard.html               # Personal User Dashboard (Viewing statistics & analytics)
├── profile.html                 # User Profile & Avatar Customizer
├── settings.html                # App Preferences & Content Settings
├── login.html                   # Authentication portal (Sign In)
├── signup.html                  # Account Registration
├── 404.html                     # Custom 404 Error Page
│
├── css/                         # Modular CSS Design System
│   ├── variables.css            # Color palettes, typography, spacing, elevations
│   ├── reset.css                # Universal CSS normalize & reset
│   ├── main.css                 # Base app styles, layout containers, buttons
│   ├── navbar.css               # Floating glass navbar & mobile drawer
│   ├── hero.css                 # Cinematic top hero spotlight
│   ├── bollywood-banner.css     # Language spotlight banners & switcher pills
│   ├── movie-card.css           # Poster cards, hover effects, badges
│   ├── movie-details.css        # Details page layout, OMDb ratings badges, awards box
│   ├── search.css               # Search bars, filter controls, chips
│   ├── category.css             # Category grids & language badges
│   ├── modal.css                # Video trailer modal styling
│   ├── skeleton.css             # Shimmer skeleton loader animations
│   └── responsive.css           # Media queries for tablet, mobile, and 4K displays
│
├── js/                          # Modular JavaScript Codebase
│   ├── app.js                   # Main application orchestrator & router
│   ├── config.js                # TMDB & OMDb API endpoints, image sizes, demo catalog
│   │
│   ├── api/                     # API Gateway Layer
│   │   ├── tmdb.js              # TMDB fetch wrapper with caching & timeouts
│   │   ├── omdb.js              # OMDb API service (IMDb, Rotten Tomatoes, Awards)
│   │   ├── movies.js            # Movie queries (trending, popular, upcoming, details)
│   │   ├── genres.js            # Genre categories & mapping
│   │   └── videos.js            # Trailer key extraction & YouTube mapping
│   │
│   ├── data/                    # Curated Data Stores
│   │   ├── allLanguagesData.js  # 100+ Multilingual movies & metadata
│   │   └── actorProfiles.js     # Verified authentic actor portraits
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── navbar.js            # Dynamic navigation header with active indicator
│   │   ├── hero.js              # Top hero banner component
│   │   ├── bollywoodBanner.js   # Interactive spotlight banner renderer
│   │   ├── movieCard.js         # Standard movie card with fallback handling
│   │   ├── movieGrid.js         # Responsive grid generator
│   │   ├── carousel.js          # Smooth horizontal scrollable carousel
│   │   ├── modal.js             # YouTube video trailer modal
│   │   ├── toast.js             # Notification alerts & toasts
│   │   └── skeleton.js          # Shimmer loading placeholders
│   │
│   ├── services/                # LocalStorage Services
│   │   ├── authService.js       # Client authentication & session management
│   │   ├── watchlistService.js  # Watchlist operations & badge sync
│   │   ├── favoriteService.js   # Favorites operations & badge sync
│   │   ├── userMovieService.js  # Watched history, user ratings, recently viewed
│   │   └── themeService.js      # Dark / Light theme switcher
│   │
│   └── utils/                   # Utilities & Helpers
│       ├── debounce.js          # Input debouncing utility
│       ├── formatters.js        # Currency, rating, date, runtime formatters
│       ├── helpers.js           # DOM manipulation & event emitters
│       └── urlParams.js         # URL search parameters parser & updater
│
├── public/                      # Static Assets (Mirroring root images)
│   └── images/                  # 100% Authentic verified posters & backdrops
├── package.json                 # Dependencies & project scripts
├── vite.config.js               # Multi-page Vite configuration
└── .env                         # API keys & environment configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Pruthviraj-patil20/Movie-Search-App.git
cd Movie-Search-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
VITE_OMDB_API_KEY=1f6bb1be
VITE_OMDB_BASE_URL=https://www.omdbapi.com/
```

> **Note:** The application comes with a zero-config fallback mode. If no TMDB key is provided, the built-in curated 100+ movie catalog, OMDb live API, and local assets will work out of the box.

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🔑 API Configuration

| API | Key | Capabilities |
| :--- | :--- | :--- |
| **TMDB API** | `VITE_TMDB_API_KEY` | Real-time trending, genre search, popular & top-rated lists, cast details |
| **OMDb API** | `1f6bb1be` | Live IMDb score & vote count, Rotten Tomatoes %, Metascore, Box Office, Awards |

---

## 💡 Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + K` or `Ctrl + K` | Focus live search bar across all pages |
| `Esc` | Close active video trailer modal or popup |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Crafted with passion for cinema by <strong>Pruthviraj Patil</strong>.</sub>
</div>