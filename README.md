# 🎬 CineSphere — Premium Movie Search & Discovery Platform

![CineSphere Banner](https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80)

> A modern, cinematic movie discovery web application inspired by the visual elegance of Apple TV+, Netflix, and HBO Max. Built entirely with **HTML5, CSS3, Vanilla JavaScript (ES6+ Modules), TMDB API, Vite, and LocalStorage** — zero external UI frameworks or runtime dependencies.

---

## 🌟 Highlights & Key Features

- **Cinematic Visual Design**: Obsidian & charcoal deep surfaces, subtle glassmorphic blur navigation, fine gradient accents, and micro-animations.
- **Dynamic Spotlight Hero**: Full-width trending movie hero with backdrop fade masks, official trailer modal player, and quick watchlist bookmarking.
- **Interactive Multi-Row Carousels**: Trending (with Day / Week toggle), Popular Worldwide, Top Rated Hits, Upcoming In Theaters, and Browse by Genre.
- **Debounced Live Search & Discovery**:
  - Live search suggestions dropdown with instant previews
  - Saved search history pills persisted to LocalStorage
  - Advanced multi-criteria filters: **Genre, Release Year, Minimum TMDB Rating, Language, and Sorting**
- **Rich Movie Details (`movie.html?id=ID`)**:
  - Full-screen dynamic backdrop hero
  - High-res poster & metadata specs (Runtime, Release Date, Status, Age Certification, Budget, Box Office Revenue, Production Companies)
  - Top Cast Slider with avatar photos and character roles
  - Embedded 16:9 YouTube Official Trailer modal with keyboard ESC and click-outside dismissal
  - Web Share API integration with automatic fallback to clipboard copy toast
  - Similar Movies & Curated Recommendations carousels
- **Personal Library Persistence**:
  - **Watchlist (`watchlist.html`)** and **Favorites (`favorites.html`)** stored in `localStorage`
  - Real-time navbar badge counters that sync instantly across tabs and pages
  - In-library live search, sorting (Recently Added, Rating, Release Year, Title), and batch clear
- **Light & Dark Theme Engine**: Handcrafted dual-theme system with persistent storage and system `prefers-color-scheme` adaptation.
- **Shimmer Skeleton Loading**: Custom CSS shimmer skeletons for all card, carousel, hero, and details states to eliminate layout shifts (CLS).
- **Graceful Error Handling & Fallbacks**: Intelligent offline and demo fallback datasets ensuring the app never crashes even during network disruptions.
- **100% Responsive & Accessible**: Custom CSS media queries for desktop, laptop, tablet, and mobile with ARIA compliance and focus indicators.

---

## 📂 Architecture & Directory Structure

```
movie-search-app/
├── index.html               # Home page (Hero spotlight, carousels, genre cards)
├── search.html              # Search & discovery page (Live filters, search history, grid)
├── movie.html               # Movie details page (Backdrop, specs, cast, trailer, recommendations)
├── watchlist.html           # Personal Watchlist page (Filter, sort, batch remove)
├── favorites.html           # Personal Favorites page (Filter, sort, batch remove)
├── 404.html                 # Cinematic 404 error page
│
├── .env                     # Vite environment variables (API keys)
├── .env.example             # Example environment template
├── .gitignore               # Ignored files and directories
├── README.md                # Project documentation
├── package.json             # Project metadata and build scripts
├── vite.config.js           # Multi-page Rollup input configuration
│
├── assets/
│   ├── images/
│   └── icons/
│
├── css/
│   ├── reset.css            # CSS reset and normalization
│   ├── variables.css        # Design tokens, themes (Dark/Light), typography, spacing
│   ├── main.css             # Base layout, buttons, badges, section headers, footer
│   ├── components.css       # Shared UI components (glass panels, rating pills, chips, progress bar)
│   ├── navbar.css           # Floating glass header and responsive mobile drawer
│   ├── hero.css             # Cinematic full-width hero spotlight
│   ├── movie-card.css       # Unified movie card component with hover actions
│   ├── movie-details.css    # Details hero, metadata grid, cast slider
│   ├── search.css           # Big search bar, suggestions dropdown, filter toolbar
│   ├── watchlist.css        # Library header, search/sort toolbar, removal animations
│   ├── skeleton.css         # Shimmer loading placeholders
│   ├── modal.css            # Accessible video trailer modal dialog
│   └── responsive.css       # Granular responsive media queries
│
├── js/
│   ├── app.js               # Global application bootstrapper and route dispatcher
│   ├── config.js            # Configuration, image sizes, fallback constants
│   │
│   ├── api/
│   │   ├── tmdb.js          # Core fetch client with cache and error handling
│   │   ├── movies.js        # Trending, Popular, Top Rated, Details, Discover endpoints
│   │   ├── genres.js        # Genre fetching and mapping utilities
│   │   └── videos.js        # Video trailer extraction
│   │
│   ├── components/
│   │   ├── navbar.js        # Navbar controller, theme switch, badge sync
│   │   ├── hero.js          # Hero banner renderer
│   │   ├── movieCard.js     # Universal movie card component
│   │   ├── movieGrid.js     # Responsive grid generator
│   │   ├── carousel.js      # Smooth horizontal scroll carousel with controls
│   │   ├── modal.js         # Trailer video modal controller
│   │   ├── loader.js        # Top loading bar simulator
│   │   ├── skeleton.js      # Skeleton HTML generators
│   │   ├── toast.js         # Accessible toast notification manager
│   │   └── emptyState.js    # Cinematic empty state placeholders
│   │
│   ├── pages/
│   │   ├── home.js          # Home page data fetching and rendering
│   │   ├── search.js        # Live search, filters, and pagination logic
│   │   ├── movieDetails.js  # Movie details, cast, similar and recommendations
│   │   ├── watchlist.js     # Watchlist controller and storage sync
│   │   └── favorites.js     # Favorites controller and storage sync
│   │
│   ├── services/
│   │   ├── storage.js       # Safe LocalStorage wrapper
│   │   ├── watchlistService.js # Watchlist state manager & event emitter
│   │   ├── favoriteService.js  # Favorites state manager & event emitter
│   │   └── themeService.js     # Dark/Light theme manager
│   │
│   └── utils/
│       ├── helpers.js       # Image URLs, DOM helpers, event emitters
│       ├── formatters.js    # Runtime, currency, dates, ratings formatting
│       ├── debounce.js      # Input debounce utility
│       ├── urlParams.js     # URL query string helpers
│       └── validators.js    # Input sanitizers and validators
│
└── public/
    ├── favicon.svg          # Cinematic vector icon
    ├── favicon.ico          # Fallback icon
    └── robots.txt           # SEO robots instructions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/movie-search-app.git
   cd movie-search-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your TMDB API key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
   ```

   > **Note on Security**: `VITE_` variables in client-side Vite applications are bundled and accessible in browser client code. For production commercial deployments requiring secret credentials or authenticated user tokens, a lightweight serverless proxy backend (e.g. Cloudflare Workers, Next.js API Routes, or Node.js Express) should be used to protect private keys.

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```
   The optimized multi-page production bundle will be output to `/dist`.

---

## 🎨 Design Philosophy & Accessibility

- **Cinematic Palette**: Balanced contrast adhering to WCAG AA guidelines with `#08090C` charcoal background and `#E50914` electric ruby accent.
- **Glassmorphism**: `backdrop-filter: blur(16px)` with subtle 1px border highlights for a floating, layered look.
- **Keyboard Navigation**: Full keyboard tab accessibility, focus outlines (`:focus-visible`), and shortcuts (press `/` or `⌘K` anywhere to search).
- **Reduced Motion Support**: Obeys `@media (prefers-reduced-motion: reduce)` to disable heavy animations for sensitive users.

---

## 📄 TMDB Attribution

This product uses the [TMDB API](https://www.themoviedb.org/) but is not endorsed or certified by TMDB. All movie images, posters, metadata, and logos are property of their respective copyright owners and The Movie Database.

---

## 📜 License

MIT License © 2026 CineSphere.
# Movie-Search-App
