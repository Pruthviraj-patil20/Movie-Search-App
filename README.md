# Movie Search App

## Features

- **Movie Discovery**: Browse trending, popular, top-rated, and upcoming movies
- **Search**: Search movies by title with debounced input
- **Filters**: Filter by genre, release year, minimum rating, language, sort by
- **Movie Details**: Full cinematic view with overview, cast, similar movies
- **Trailer Player**: Watch YouTube trailers in a premium modal
- **Watchlist**: Save movies to watchlist, persists in localStorage
- **Favorites**: Add movies to favorites, separate localStorage storage
- **Dark/Light Theme**: Cinematic dark mode with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Skeleton Loading**: Premium shimmer animations during data loading
- **Error States**: Professional error messages when things go wrong
- **Toast Notifications**: Success and error messages with animations
- **Share Feature**: Copy movie URL to clipboard or Web Share API
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, focus states

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, variables, responsive design
- **JavaScript** - ES modules, no frameworks
- **Vite** - Fast dev server and build
- **TMDB API** - The Movie Database API
- **localStorage** - Client-side data persistence
- **Lucide Icons** - Modern icon set

## Project Architecture

```
movie-search-app/
├── index.html          # Home page - hero, trending, popular, top-rated, upcoming, genres
├── search.html         # Search page - advanced search with filters
├── movie.html          # Movie details page - full cinematic view
├── watchlist.html      # Watchlist page - LocalStorage persistence
├── favorites.html      # Favorites page - LocalStorage persistence
├── dashboard.html      # Personal dashboard - stats, recently viewed, recommendations
├── 404.html            # Custom 404 page
├── .env               # TMDB API configuration
├── .env.example       # Environment variable examples
├── package.json       # Vite + lucide only (no framework deps)
├── vite.config.js     # Vite configuration
├── css/               # 17 CSS files - design system, components, pages
│   ├── variables.css  # Design tokens (colors, typography, spacing, shadows)
│   ├── reset.css      # CSS reset
│   ├── main.css       # Core styles
│   ├── components.css # Component base styles
│   ├── navbar.css     # Navigation bar styling
│   ├── hero.css       # Hero section styling
│   ├── movie-card.css # Movie card styling
│   ├── movie-details.css # Movie details page styling
│   ├── search.css     # Search page styling
│   ├── watchlist.css  # Watchlist page styling
│   ├── skeleton.css   # Loading skeleton animations
│   ├── modal.css      # Modal/styling
│   ├── ratingModal.css # Rating modal styling
│   ├── settings.css   # Settings page styling
│   ├── profile.css    # Profile page styling
│   ├── watchlist.css  # Watchlist page secondary styling
│   └── responsive.css # Responsive design media queries
├── js/
│   ├── app.js         # Main bootstrapper - initializes theme, auth, routes
│   ├── config.js      # Configuration - TMDB endpoints, image sizes, storage keys
│   │
│   ├── api/           # TMDB API layer with demo data fallbacks
│   │   ├── tmdb.js    # Base fetch with caching, timeout, error handling
│   │   ├── movies.js  # Movie queries (trending, popular, search, discover, etc.)
│   │   ├── genres.js  # Genre list with defaults
│   │   └── videos.js  # Trailer extraction
│   │
│   ├── services/      # localStorage-powered services
│   │   ├── authService.js      # Pure frontend auth (localStorage)
│   │   ├── userMovieService.js # Watchlist/favorites/watched/ratings history
│   │   ├── analyticsService.js # Stats from localStorage data
│   │   ├── themeService.js     # Dark/light theme persistence
│   │   ├── userService.js      # Profile, avatar, preferences
│   │   ├── watchlistService.js # Watchlist operations
│   │   └── favoriteService.js  # Favorites operations
│   │
│   ├── pages/         # Page controllers
│   │   ├── home.js          # Home page controller
│   │   ├── search.js        # Search page controller
│   │   ├── movieDetails.js  # Movie details controller
│   │   ├── watchlist.js     # Watchlist page controller
│   │   ├── favorites.js     # Favorites page controller
│   │   └── dashboard.js     # Dashboard controller
│   │
│   ├── components/    # Reusable UI components
│   │   ├── navbar.js        # Glass navigation with auth state
│   │   ├── hero.js          # Cinematic hero banner
│   │   ├── movieCard.js     # Reusable movie card component
│   │   ├── movieGrid.js     # Movie grid layout
│   │   ├── carousel.js      # Horizontal movie carousel
│   │   ├── modal.js         # YouTube trailer modal
│   │   ├── loader.js        # Progress bar loader
│   │   ├── skeleton.js      # Shimmer loading animations
│   │   ├── toast.js         # Toast notifications
│   │   └── emptyState.js    # Empty state illustrations
│   │
│   └── utils/         # Utilities
│       ├── helpers.js       # DOM helpers, event emission
│       ├── formatters.js    # Rating, year, runtime formatters
│       ├── debounce.js      # Input debouncing
│       ├── urlParams.js     # URL query parameter handling
│       └── validators.js    # Input validation
│
├── assets/
│   ├── images/          # Poster placeholder images
│   └── icons/           # Icon assets
│
├── 404.html
├── .gitignore
├── README.md
└── package.json
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
```

**Important**: The `VITE_` prefixed variables are exposed to the browser. This is acceptable for TMDB API keys since they have built-in rate limiting and IP restrictions. For production applications requiring truly secret credentials, a backend proxy should be used.

To get a TMDB API key:
1. Go to https://www.themoviedb.org/ and create an account
2. Apply for an API key in the Settings section
3. Use the default base URLs above

## Running Locally

```bash
# Development with hot module replacement
npm run dev

# Open http://localhost:5173 in your browser

# Build for production
npm run build

# Preview the build
npm run preview
```

## Folder Structure

The project follows a modular architecture with strict separation of concerns:

- **api/** - TMDB API integration with error handling and demo fallbacks
- **services/** - localStorage-powered data persistence (no backend needed)
- **pages/** - Page-specific controllers that orchestrate the UI
- **components/** - Reusable UI components (card, carousel, modal, etc.)
- **utils/** - Helper functions and formatting utilities
- **css/** - Design tokens and component-specific styles

All JavaScript uses ES module imports/exports, keeping responsibilities separated.

## Screenshots

*(Add screenshots of each page here for the portfolio)*

## Features Roadmap

- [ ] Integration with TMDB API key
- [ ] User accounts with email/password authentication
- [ ] Advanced filtering with more criteria
- [ ] Infinite scroll and pagination
- [ ] Movie recommendations engine
- [ ] Social sharing with custom Og tags

## Folder Structure

See the architecture section above for the complete directory layout.

## Author

Built with premium cinematic design and JavaScript.

## License

MIT License - feel free to use this as a portfolio project or starting point.