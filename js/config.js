/**
 * CineSphere Configuration Module
 * Manages environment variables, TMDB endpoints, and image resolutions
 */

export const CONFIG = {
  API_KEY: import.meta.env.VITE_TMDB_API_KEY || 'c3590dc2e74e64f89d316cb6beafbc60',
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/',
  
  // Image Quality Presets
  IMAGE_SIZES: {
    POSTER_SMALL: 'w342',
    POSTER_MEDIUM: 'w500',
    POSTER_LARGE: 'w780',
    BACKDROP_SMALL: 'w780',
    BACKDROP_MEDIUM: 'w1280',
    BACKDROP_ORIGINAL: 'original',
    PROFILE_MEDIUM: 'w185'
  },

  // Fallback Placeholders
  FALLBACK_POSTER: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
  FALLBACK_BACKDROP: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  FALLBACK_AVATAR: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',

  // Local Storage Keys
  STORAGE_KEYS: {
    WATCHLIST: 'cinesphere_watchlist_v1',
    FAVORITES: 'cinesphere_favorites_v1',
    SEARCH_HISTORY: 'cinesphere_search_history_v1',
    THEME: 'cinesphere_theme_v1'
  },

  // Search History Limit
  MAX_SEARCH_HISTORY: 8,

  // Curated Fallback Data for Zero-Failure Guarantees
  DEMO_MOVIES: [
    {
      id: 27205,
      title: "Inception",
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      vote_average: 8.4,
      release_date: "2010-07-15",
      genre_ids: [28, 878, 12]
    },
    {
      id: 157336,
      title: "Interstellar",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      vote_average: 8.4,
      release_date: "2014-11-05",
      genre_ids: [12, 18, 878]
    },
    {
      id: 155,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      vote_average: 8.5,
      release_date: "2008-07-16",
      genre_ids: [18, 28, 80, 53]
    },
    {
      id: 693134,
      title: "Dune: Part Two",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
      poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg",
      vote_average: 8.2,
      release_date: "2024-02-27",
      genre_ids: [878, 12]
    },
    {
      id: 872585,
      title: "Oppenheimer",
      overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
      poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
      vote_average: 8.1,
      release_date: "2023-07-19",
      genre_ids: [18, 36]
    }
  ]
};
