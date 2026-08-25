/**
 * CineSphere Configuration Module
 * Manages environment variables, TMDB endpoints, image resolutions, and demo catalogs
 */

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

// Ensure valid API key fallback if placeholder or empty string is provided in .env
const rawApiKey = env.VITE_TMDB_API_KEY;
const isPlaceholderKey = !rawApiKey || rawApiKey.includes('YOUR_TMDB_API_KEY') || rawApiKey.trim() === '';
const DEFAULT_TMDB_KEY = 'c3590dc2e74e64f89d316cb6beafbc60';

export const CONFIG = {
  API_KEY: isPlaceholderKey ? DEFAULT_TMDB_KEY : rawApiKey.trim(),
  BASE_URL: env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/',
  
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

  // Curated 20+ Movie Catalog for Instant, Zero-Failure Delivery
  DEMO_MOVIES: [
    {
      id: 27205,
      title: "Inception",
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
      poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
      vote_average: 8.4,
      vote_count: 36240,
      release_date: "2010-07-15",
      genre_ids: [28, 878, 12],
      runtime: 148,
      status: "Released",
      tagline: "Your mind is the scene of the crime.",
      budget: 160000000,
      revenue: 836836967,
      trailer_key: "YoHD9XEInc0",
      production_companies: [{ name: "Warner Bros. Pictures" }, { name: "Syncopy" }],
      credits: {
        cast: [
          { name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Elliot Page", character: "Ariadne", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Tom Hardy", character: "Eames", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Cillian Murphy", character: "Robert Fischer", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 157336,
      title: "Interstellar",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      vote_average: 8.4,
      vote_count: 34100,
      release_date: "2014-11-05",
      genre_ids: [12, 18, 878],
      runtime: 169,
      status: "Released",
      tagline: "Mankind was born on Earth. It was never meant to die here.",
      budget: 165000000,
      revenue: 773867216,
      trailer_key: "zSWdZVtXT7E",
      production_companies: [{ name: "Paramount" }, { name: "Warner Bros. Pictures" }, { name: "Syncopy" }],
      credits: {
        cast: [
          { name: "Matthew McConaughey", character: "Cooper", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Anne Hathaway", character: "Brand", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Jessica Chastain", character: "Murph", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
          { name: "Michael Caine", character: "Professor Brand", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 155,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      vote_average: 8.5,
      vote_count: 32000,
      release_date: "2008-07-16",
      genre_ids: [18, 28, 80, 53],
      runtime: 152,
      status: "Released",
      tagline: "Why so serious?",
      budget: 185000000,
      revenue: 1004558444,
      trailer_key: "EXeTwQWrcwY",
      production_companies: [{ name: "Warner Bros. Pictures" }, { name: "Legendary Pictures" }, { name: "Syncopy" }],
      credits: {
        cast: [
          { name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Heath Ledger", character: "Joker", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Aaron Eckhart", character: "Harvey Dent / Two-Face", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Gary Oldman", character: "James Gordon", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 693134,
      title: "Dune: Part Two",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
      poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg",
      vote_average: 8.2,
      vote_count: 5300,
      release_date: "2024-02-27",
      genre_ids: [878, 12],
      runtime: 166,
      status: "Released",
      tagline: "Long live the fighters.",
      budget: 190000000,
      revenue: 714444358,
      trailer_key: "Way9Dexny3w",
      production_companies: [{ name: "Legendary Pictures" }, { name: "Warner Bros. Pictures" }],
      credits: {
        cast: [
          { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" },
          { name: "Zendaya", character: "Chani", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" },
          { name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
          { name: "Austin Butler", character: "Feyd-Rautha", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 872585,
      title: "Oppenheimer",
      overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
      poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
      vote_average: 8.1,
      vote_count: 9100,
      release_date: "2023-07-19",
      genre_ids: [18, 36],
      runtime: 180,
      status: "Released",
      tagline: "The world forever changes.",
      budget: 100000000,
      revenue: 957000000,
      trailer_key: "uYPbbksJxIg",
      production_companies: [{ name: "Syncopy" }, { name: "Universal Pictures" }, { name: "Atlas Entertainment" }],
      credits: {
        cast: [
          { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Matt Damon", character: "Leslie Groves", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 569094,
      title: "Spider-Man: Across the Spider-Verse",
      overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",
      poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
      vote_average: 8.4,
      vote_count: 7200,
      release_date: "2023-05-31",
      genre_ids: [16, 28, 12, 878],
      runtime: 140,
      status: "Released",
      tagline: "It's how you wear the mask that matters.",
      budget: 100000000,
      revenue: 690516673,
      trailer_key: "cqGjhVJWtEg",
      production_companies: [{ name: "Columbia Pictures" }, { name: "Sony Pictures Animation" }, { name: "Marvel Entertainment" }],
      credits: {
        cast: [
          { name: "Shameik Moore", character: "Miles Morales / Spider-Man", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman", profile_path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
          { name: "Oscar Isaac", character: "Miguel O'Hara / Spider-Man 2099", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 76600,
      title: "Avatar: The Way of Water",
      overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, and the lengths they go to keep each other safe.",
      poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdrop_path: "/s16H6tpK2utvwDtzZIMQn06qjwn.jpg",
      vote_average: 7.7,
      vote_count: 11400,
      release_date: "2022-12-14",
      genre_ids: [878, 12, 28],
      runtime: 192,
      status: "Released",
      tagline: "Return to Pandora.",
      budget: 350000000,
      revenue: 2320250281,
      trailer_key: "d9MyW72ELq0",
      production_companies: [{ name: "Lightstorm Entertainment" }, { name: "20th Century Studios" }],
      credits: {
        cast: [
          { name: "Sam Worthington", character: "Jake Sully", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Zoe Saldaña", character: "Neytiri", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Sigourney Weaver", character: "Kiri", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 361743,
      title: "Top Gun: Maverick",
      overview: "After more than thirty years of service as one of the Navy’s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
      poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      backdrop_path: "/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg",
      vote_average: 8.2,
      vote_count: 8900,
      release_date: "2022-05-24",
      genre_ids: [28, 18],
      runtime: 130,
      status: "Released",
      tagline: "Feel the need. The need for speed.",
      budget: 170000000,
      revenue: 1495696292,
      trailer_key: "giXco2jaZ_4",
      production_companies: [{ name: "Paramount" }, { name: "Skydance" }, { name: "Jerry Bruckheimer Films" }],
      credits: {
        cast: [
          { name: "Tom Cruise", character: "Capt. Pete 'Maverick' Mitchell", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Miles Teller", character: "Lt. Bradley 'Rooster' Bradshaw", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Jennifer Connelly", character: "Penny Benjamin", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 278,
      title: "The Shawshank Redemption",
      overview: "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
      poster_path: "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      vote_average: 8.7,
      vote_count: 27000,
      release_date: "1994-09-23",
      genre_ids: [18, 80],
      runtime: 142,
      status: "Released",
      tagline: "Fear can hold you prisoner. Hope can set you free.",
      budget: 25000000,
      revenue: 58500000,
      trailer_key: "PLl99DlL6b4",
      production_companies: [{ name: "Castle Rock Entertainment" }, { name: "Warner Bros. Pictures" }],
      credits: {
        cast: [
          { name: "Tim Robbins", character: "Andy Dufresne", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Bob Gunton", character: "Warden Norton", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 680,
      title: "Pulp Fiction",
      overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling comedic crime caper.",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      vote_average: 8.5,
      vote_count: 27500,
      release_date: "1994-09-10",
      genre_ids: [53, 80],
      runtime: 154,
      status: "Released",
      tagline: "Just because you are a character doesn't mean that you have character.",
      budget: 8000000,
      revenue: 213928762,
      trailer_key: "s7EdQ4FqbhY",
      production_companies: [{ name: "Miramax" }, { name: "A Band Apart" }],
      credits: {
        cast: [
          { name: "John Travolta", character: "Vincent Vega", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Samuel L. Jackson", character: "Jules Winnfield", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Uma Thurman", character: "Mia Wallace", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Bruce Willis", character: "Butch Coolidge", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 550,
      title: "Fight Club",
      overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      vote_average: 8.4,
      vote_count: 28800,
      release_date: "1999-10-15",
      genre_ids: [18],
      runtime: 139,
      status: "Released",
      tagline: "Mischief. Mayhem. Soap.",
      budget: 63000000,
      revenue: 100853753,
      trailer_key: "O1nDozs-96U",
      production_companies: [{ name: "Fox 2000 Pictures" }, { name: "Regency Enterprises" }],
      credits: {
        cast: [
          { name: "Edward Norton", character: "The Narrator", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Brad Pitt", character: "Tyler Durden", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Helena Bonham Carter", character: "Marla Singer", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 603,
      title: "The Matrix",
      overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/l4QHerTSbflURdsWbeUp97WWzrR.jpg",
      vote_average: 8.2,
      vote_count: 25000,
      release_date: "1999-03-30",
      genre_ids: [28, 878],
      runtime: 136,
      status: "Released",
      tagline: "Welcome to the Real World.",
      budget: 63000000,
      revenue: 467222728,
      trailer_key: "vKQi3bBA1y8",
      production_companies: [{ name: "Village Roadshow Pictures" }, { name: "Silver Pictures" }, { name: "Warner Bros. Pictures" }],
      credits: {
        cast: [
          { name: "Keanu Reeves", character: "Thomas A. Anderson / Neo", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Laurence Fishburne", character: "Morpheus", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Carrie-Anne Moss", character: "Trinity", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Hugo Weaving", character: "Agent Smith", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 98,
      title: "Gladiator",
      overview: "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army's most capable generals.",
      poster_path: "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
      backdrop_path: "/hHE4x2xLnhxTq5i1X00H0Q6p21L.jpg",
      vote_average: 8.2,
      vote_count: 18000,
      release_date: "2000-05-01",
      genre_ids: [28, 18, 12],
      runtime: 155,
      status: "Released",
      tagline: "What we do in life echoes in eternity.",
      budget: 103000000,
      revenue: 465380802,
      trailer_key: "P5ieIbInFpg",
      production_companies: [{ name: "DreamWorks Pictures" }, { name: "Universal Pictures" }, { name: "Scott Free Productions" }],
      credits: {
        cast: [
          { name: "Russell Crowe", character: "Maximus Decimus Meridius", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Joaquin Phoenix", character: "Commodus", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Connie Nielsen", character: "Lucilla", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 299534,
      title: "Avengers: Endgame",
      overview: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
      poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      vote_average: 8.3,
      vote_count: 25000,
      release_date: "2019-04-24",
      genre_ids: [12, 878, 28],
      runtime: 181,
      status: "Released",
      tagline: "Part of the journey is the end.",
      budget: 356000000,
      revenue: 2799439100,
      trailer_key: "TcMBFSGVi1c",
      production_companies: [{ name: "Marvel Studios" }],
      credits: {
        cast: [
          { name: "Robert Downey Jr.", character: "Tony Stark / Iron Man", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Chris Evans", character: "Steve Rogers / Captain America", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Mark Ruffalo", character: "Bruce Banner / Hulk", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Chris Hemsworth", character: "Thor", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Scarlett Johansson", character: "Natasha Romanoff / Black Widow", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 496243,
      title: "Parasite",
      overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
      vote_average: 8.5,
      vote_count: 18000,
      release_date: "2019-05-30",
      genre_ids: [35, 53, 18],
      runtime: 132,
      status: "Released",
      tagline: "Act like you own the place.",
      budget: 11400000,
      revenue: 263136741,
      trailer_key: "5xH0RzeSojI",
      production_companies: [{ name: "Barunson E&A" }, { name: "CJ Entertainment" }],
      credits: {
        cast: [
          { name: "Song Kang-ho", character: "Kim Ki-taek", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Lee Sun-kyun", character: "Park Dong-ik", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Cho Yeo-jeong", character: "Park Yeon-gyo", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 244786,
      title: "Whiplash",
      overview: "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing himself to the emotional brink.",
      poster_path: "/7fn624j5lj3xTmeS08897dBDAIO.jpg",
      backdrop_path: "/6bbZ6XyvgfjhQwfplTRUhNDx201.jpg",
      vote_average: 8.4,
      vote_count: 15000,
      release_date: "2014-10-10",
      genre_ids: [18, 10402],
      runtime: 107,
      status: "Released",
      tagline: "The road to greatness can take you to the edge.",
      budget: 3300000,
      revenue: 48982041,
      trailer_key: "7d_jQycdQGo",
      production_companies: [{ name: "Bold Films" }, { name: "Blumhouse Productions" }, { name: "Right of Way Films" }],
      credits: {
        cast: [
          { name: "Miles Teller", character: "Andrew Neiman", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "J.K. Simmons", character: "Terence Fletcher", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Paul Reiser", character: "Jim Neiman", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 335984,
      title: "Blade Runner 2049",
      overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
      poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      backdrop_path: "/ilRyazdMJwN05exqhwK4tMKBYZs.jpg",
      vote_average: 7.6,
      vote_count: 13000,
      release_date: "2017-10-04",
      genre_ids: [878, 18],
      runtime: 164,
      status: "Released",
      tagline: "There's still a page left.",
      budget: 150000000,
      revenue: 259239658,
      trailer_key: "gCcx85zbxz4",
      production_companies: [{ name: "Alcon Entertainment" }, { name: "Columbia Pictures" }, { name: "Scott Free Productions" }],
      credits: {
        cast: [
          { name: "Ryan Gosling", character: "K", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Harrison Ford", character: "Rick Deckard", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Ana de Armas", character: "Joi", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 634649,
      title: "Spider-Man: No Way Home",
      overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
      poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdrop_path: "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
      vote_average: 8.0,
      vote_count: 20000,
      release_date: "2021-12-15",
      genre_ids: [28, 12, 878],
      runtime: 148,
      status: "Released",
      tagline: "The Multiverse Unleashed.",
      budget: 200000000,
      revenue: 1921847111,
      trailer_key: "JfVOs4VSpmA",
      production_companies: [{ name: "Marvel Studios" }, { name: "Columbia Pictures" }, { name: "Pascal Pictures" }],
      credits: {
        cast: [
          { name: "Tom Holland", character: "Peter Parker / Spider-Man", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" },
          { name: "Zendaya", character: "MJ", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" },
          { name: "Benedict Cumberbatch", character: "Doctor Strange", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Jacob Batalon", character: "Ned Leeds", profile_path: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
          { name: "Willem Dafoe", character: "Norman Osborn / Green Goblin", profile_path: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 414906,
      title: "The Batman",
      overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
      vote_average: 7.7,
      vote_count: 9800,
      release_date: "2022-03-01",
      genre_ids: [80, 9648, 53],
      runtime: 176,
      status: "Released",
      tagline: "Unmask the truth.",
      budget: 185000000,
      revenue: 770945583,
      trailer_key: "mqqft2x_Aa4",
      production_companies: [{ name: "Warner Bros. Pictures" }, { name: "6th & Idaho" }, { name: "Dylan Clark Productions" }],
      credits: {
        cast: [
          { name: "Robert Pattinson", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Paul Dano", character: "Edward Nashton / Riddler", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Colin Farrell", character: "Oswald Cobblepot / Penguin", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 603692,
      title: "John Wick: Chapter 4",
      overview: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table.",
      poster_path: "/vZloFAK7NKnMGKEslUsZ2VoJ7bB.jpg",
      backdrop_path: "/7I6VUdPj6tQECNHdviJkUHD2389.jpg",
      vote_average: 7.8,
      vote_count: 6200,
      release_date: "2023-03-22",
      genre_ids: [28, 53, 80],
      runtime: 169,
      status: "Released",
      tagline: "No way back. One way out.",
      budget: 100000000,
      revenue: 440146694,
      trailer_key: "qEVUtrk8_B4",
      production_companies: [{ name: "Thunder Road" }, { name: "87Eleven" }, { name: "Lionsgate" }],
      credits: {
        cast: [
          { name: "Keanu Reeves", character: "John Wick", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Donnie Yen", character: "Caine", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Bill Skarsgård", character: "Marquis de Gramont", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Ian McShane", character: "Winston Scott", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- BOLLYWOOD & CLASSICS --- */
    {
      id: 111101,
      title: "Sholay",
      overview: "After his family is murdered by a ruthless bandit, a former police officer enlists the help of two convicts to capture him.",
      poster_path: "images/bollywood/sholay_poster.jpg",
      backdrop_path: "images/bollywood/sholay_banner.jpg",
      vote_average: 8.3,
      vote_count: 35000,
      release_date: "1975-08-15",
      genre_ids: [28, 12, 18],
      runtime: 204,
      status: "Released",
      tagline: "The Greatest Star Cast Ever Assembled! The Greatest Story Ever Told!",
      budget: 30000000,
      revenue: 500000000,
      trailer_key: "qL3XQk7w7H8",
      production_companies: [{ name: "Sippy Films" }],
      credits: {
        cast: [
          { name: "Amitabh Bachchan", character: "Jai", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Dharmendra", character: "Veeru", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Amjad Khan", character: "Gabbar Singh", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Hema Malini", character: "Basanti", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 20453,
      title: "3 Idiots",
      overview: "Two friends search for their long-lost companion Rancho while reminiscing about their innovative student days at an elite engineering institute.",
      poster_path: "images/bollywood/3idiots_poster.jpg",
      backdrop_path: "images/bollywood/3idiots_banner.jpg",
      vote_average: 8.5,
      vote_count: 42000,
      release_date: "2009-12-25",
      genre_ids: [35, 18],
      runtime: 170,
      status: "Released",
      tagline: "Don't chase success, chase excellence, and success will follow.",
      budget: 55000000,
      revenue: 4000000000,
      trailer_key: "xvszmNXdM4w",
      production_companies: [{ name: "Vinod Chopra Films" }],
      credits: {
        cast: [
          { name: "Aamir Khan", character: "Rancho", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "R. Madhavan", character: "Farhan", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Sharman Joshi", character: "Raju", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Kareena Kapoor", character: "Pia", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 975069,
      title: "Dangal",
      overview: "Mahavir Singh Phogat, a former wrestler, decides to fulfill his dream of winning a gold medal for India by training his daughters Geeta and Babita for the Commonwealth Games.",
      poster_path: "images/bollywood/dangal_poster.jpg",
      backdrop_path: "images/bollywood/dangal_banner.jpg",
      vote_average: 8.4,
      vote_count: 28000,
      release_date: "2016-12-23",
      genre_ids: [28, 18, 36],
      runtime: 161,
      status: "Released",
      tagline: "Mhari chhoriyan chhoron se kam hain ke?",
      budget: 70000000,
      revenue: 20000000000,
      trailer_key: "x_7YlGv9u1g",
      production_companies: [{ name: "Aamir Khan Productions" }, { name: "Walt Disney Pictures" }],
      credits: {
        cast: [
          { name: "Aamir Khan", character: "Mahavir Singh Phogat", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Fatima Sana Shaikh", character: "Geeta Phogat", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Sanya Malhotra", character: "Babita Kumari", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 111102,
      title: "Lagaan: Once Upon a Time in India",
      overview: "In 1893 Victorian India, the people of a small village stake their future on a high-stakes cricket match against British officers to escape oppressive land taxes.",
      poster_path: "images/bollywood/lagaan_poster.jpg",
      backdrop_path: "images/bollywood/lagaan_banner.jpg",
      vote_average: 8.1,
      vote_count: 22000,
      release_date: "2001-06-15",
      genre_ids: [18, 12],
      runtime: 224,
      status: "Released",
      tagline: "A film by Ashutosh Gowariker.",
      budget: 25000000,
      revenue: 659000000,
      trailer_key: "oSIGJ347Jsw",
      production_companies: [{ name: "Aamir Khan Productions" }],
      credits: {
        cast: [
          { name: "Aamir Khan", character: "Bhuvan", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Gracy Singh", character: "Gauri", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 111107,
      title: "Dilwale Dulhania Le Jayenge",
      overview: "Raj and Simran fall in love during a vacation through Europe. To marry Simran, Raj travels to Punjab to win over her conservative father before her arranged marriage.",
      poster_path: "images/bollywood/ddlj_poster.jpg",
      backdrop_path: "images/bollywood/ddlj_banner.jpg",
      vote_average: 8.6,
      vote_count: 31000,
      release_date: "1995-10-20",
      genre_ids: [10749, 18, 35],
      runtime: 189,
      status: "Released",
      tagline: "Come... fall in love all over again.",
      budget: 40000000,
      revenue: 2000000000,
      trailer_key: "c25GKl5VNeY",
      production_companies: [{ name: "Yash Raj Films" }],
      credits: {
        cast: [
          { name: "Shah Rukh Khan", character: "Raj Malhotra", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Kajol", character: "Simran Singh", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 872906,
      title: "Jawan",
      overview: "A prison warden recruits inmates to commit outrageous acts of vigilante justice that expose deep-seated corruption across the nation.",
      poster_path: "images/bollywood/jawan_poster.jpg",
      backdrop_path: "images/bollywood/jawan_banner.jpg",
      vote_average: 7.9,
      vote_count: 24000,
      release_date: "2023-09-07",
      genre_ids: [28, 53],
      runtime: 169,
      status: "Released",
      tagline: "Ready or Not, here he comes.",
      budget: 3000000000,
      revenue: 11500000000,
      trailer_key: "MWOlnZSnXWE",
      production_companies: [{ name: "Red Chillies Entertainment" }],
      credits: {
        cast: [
          { name: "Shah Rukh Khan", character: "Vikram Rathore / Azad", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Nayanthara", character: "Narmada Rai", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Vijay Sethupathi", character: "Kalee Gaikwad", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 346428,
      title: "Sanju",
      overview: "The compelling biography of film star Sanjay Dutt, exploring his rise to stardom, battle with addiction, imprisonment, and redemption.",
      poster_path: "images/bollywood/sanju_poster.jpg",
      backdrop_path: "images/bollywood/dangal_banner.jpg",
      vote_average: 7.6,
      vote_count: 15000,
      release_date: "2018-06-29",
      genre_ids: [18, 36],
      runtime: 157,
      status: "Released",
      tagline: "The real story of a star.",
      budget: 1000000000,
      revenue: 5860000000,
      trailer_key: "rRr1QIoxnGQ",
      production_companies: [{ name: "Rajkumar Hirani Films" }, { name: "Vinod Chopra Films" }],
      credits: {
        cast: [
          { name: "Ranbir Kapoor", character: "Sanjay Dutt", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Paresh Rawal", character: "Sunil Dutt", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Vicky Kaushal", character: "Kamlesh", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 15501,
      title: "Bajrangi Bhaijaan",
      overview: "A compassionate Indian man embarks on a heartfelt mission to reunite a mute Pakistani girl with her family across the border.",
      poster_path: "images/bollywood/bajrangi_poster.jpg",
      backdrop_path: "images/bollywood/dangal_banner.jpg",
      vote_average: 8.1,
      vote_count: 18000,
      release_date: "2015-07-17",
      genre_ids: [18, 12, 35],
      runtime: 163,
      status: "Released",
      tagline: "Stories of compassion know no borders.",
      budget: 900000000,
      revenue: 9690000000,
      trailer_key: "4nwAra0mz_Q",
      production_companies: [{ name: "Salman Khan Films" }, { name: "Kabir Khan Films" }],
      credits: {
        cast: [
          { name: "Salman Khan", character: "Pawan Kumar Chaturvedi", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Harshaali Malhotra", character: "Shahida (Munni)", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
          { name: "Nawazuddin Siddiqui", character: "Chand Nawab", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- TAMIL MOVIES (KOLLYWOOD) --- */
    {
      id: 969492,
      title: "Leo",
      overview: "Parthiban, a mild-mannered cafe owner in Himachal Pradesh, is pursued by dangerous drug cartels who believe he is a legendary gangster named Leo Das.",
      poster_path: "images/tamil/leo_poster.jpg",
      backdrop_path: "images/tamil/leo_banner.jpg",
      vote_average: 7.8,
      vote_count: 21000,
      release_date: "2023-10-19",
      genre_ids: [28, 80, 53],
      runtime: 164,
      status: "Released",
      tagline: "Bloody Sweet.",
      budget: 3000000000,
      revenue: 6200000000,
      trailer_key: "Po3jStA673E",
      production_companies: [{ name: "Seven Screen Studio" }],
      credits: {
        cast: [
          { name: "Thalapathy Vijay", character: "Parthiban / Leo Das", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Sanjay Dutt", character: "Antony Das", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Trisha Krishnan", character: "Sathya", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 987917,
      title: "Jailer",
      overview: "Muthuvel Pandian, a retired prison warden known as Tiger Muthuvel, unleashes his lethal past to protect his family against an idol smuggling kingpin.",
      poster_path: "images/tamil/jailer_poster.jpg",
      backdrop_path: "images/tamil/jailer_banner.jpg",
      vote_average: 7.7,
      vote_count: 19000,
      release_date: "2023-08-10",
      genre_ids: [28, 35, 80],
      runtime: 168,
      status: "Released",
      tagline: "Superstar Rajinikanth in and as Jailer.",
      budget: 2000000000,
      revenue: 6500000000,
      trailer_key: "Y5BeWdODPqo",
      production_companies: [{ name: "Sun Pictures" }],
      credits: {
        cast: [
          { name: "Rajinikanth", character: "Tiger Muthuvel Pandian", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Vinayakan", character: "Varman", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Mohanlal", character: "Mathew (Cameo)", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 755566,
      title: "Vikram",
      overview: "A high-octane special black-ops squad led by Amar investigates a series of murders committed by a masked vigilante group led by Commander Vikram.",
      poster_path: "images/tamil/vikram_poster.jpg",
      backdrop_path: "images/tamil/vikram_banner.jpg",
      vote_average: 8.3,
      vote_count: 26000,
      release_date: "2022-06-03",
      genre_ids: [28, 53, 80],
      runtime: 175,
      status: "Released",
      tagline: "Once upon a time there lived a ghost...",
      budget: 1500000000,
      revenue: 4500000000,
      trailer_key: "OKBMCLpJqk8",
      production_companies: [{ name: "Raaj Kamal Films International" }],
      credits: {
        cast: [
          { name: "Kamal Haasan", character: "Commander Arun Kumar Vikram", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Fahadh Faasil", character: "Amar", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Vijay Sethupathi", character: "Sandhanam", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 554600,
      title: "Ponniyin Selvan: Part 1",
      overview: "Vandiyathevan sets out to cross the Chola kingdom with messages between crown prince Aditha Karikalan and princess Kundavai amidst brewing royal conspiracies.",
      poster_path: "images/tamil/ps1_poster.jpg",
      backdrop_path: "images/tamil/ps1_banner.jpg",
      vote_average: 7.9,
      vote_count: 17000,
      release_date: "2022-09-30",
      genre_ids: [28, 18, 12],
      runtime: 167,
      status: "Released",
      tagline: "The Cholas are coming.",
      budget: 2500000000,
      revenue: 5000000000,
      trailer_key: "K_5a3hnN6j8",
      production_companies: [{ name: "Madras Talkies" }, { name: "Lyca Productions" }],
      credits: {
        cast: [
          { name: "Vikram", character: "Aditha Karikalan", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Aishwarya Rai Bachchan", character: "Nandini / Mandakini", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Karthi", character: "Vallavaraiyan Vandiyadevan", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- MARATHI MOVIES (GEMS) --- */
    {
      id: 395990,
      title: "Sairat",
      overview: "In rural Maharashtra, a passionate love story between Prashant and Archie defies traditional caste and societal boundaries, triggering profound repercussions.",
      poster_path: "images/marathi/sairat_poster.jpg",
      backdrop_path: "images/marathi/sairat_banner.jpg",
      vote_average: 8.3,
      vote_count: 25000,
      release_date: "2016-04-29",
      genre_ids: [18, 10749],
      runtime: 174,
      status: "Released",
      tagline: "Zing Zing Zingat!",
      budget: 40000000,
      revenue: 1100000000,
      trailer_key: "wMrMKnoW4L4",
      production_companies: [{ name: "Aatpat Production" }, { name: "Zee Studios" }],
      credits: {
        cast: [
          { name: "Rinku Rajguru", character: "Archana 'Archie' Patil", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Somnath Awghade", character: "Prashant 'Parshya' Kale", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 376288,
      title: "Natsamrat",
      overview: "A legendary Shakespearean theatre actor and his devoted wife face bitter rejection, abandonment, and heartbreak from their ungrateful children in his sunset years.",
      poster_path: "images/marathi/natsamrat_poster.jpg",
      backdrop_path: "images/marathi/natsamrat_banner.jpg",
      vote_average: 8.9,
      vote_count: 18000,
      release_date: "2016-01-01",
      genre_ids: [18],
      runtime: 166,
      status: "Released",
      tagline: "Kuni ghar deta ka ghar?",
      budget: 90000000,
      revenue: 500000000,
      trailer_key: "K_5d4Wn6j1A",
      production_companies: [{ name: "Fincraft Media" }, { name: "Zee Studios" }],
      credits: {
        cast: [
          { name: "Nana Patekar", character: "Ganpatrao Ramchandra Belwalkar", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Medha Manjrekar", character: "Kaveri Belwalkar", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Vikram Gokhale", character: "Rambhau", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 367683,
      title: "Katyar Kaljat Ghusali",
      overview: "A duel of artistic mastery, vocal ragas, and profound pride erupts between two royal court singers in the princely state of Vishrampur.",
      poster_path: "images/marathi/katyar_poster.jpg",
      backdrop_path: "images/marathi/katyar_banner.jpg",
      vote_average: 8.5,
      vote_count: 12000,
      release_date: "2015-11-12",
      genre_ids: [18, 10402],
      runtime: 162,
      status: "Released",
      tagline: "Sur Niragas Ho...",
      budget: 60000000,
      revenue: 400000000,
      trailer_key: "tq4R3yH6h3k",
      production_companies: [{ name: "Essel Vision Productions" }],
      credits: {
        cast: [
          { name: "Sachin Pilgaonkar", character: "Khan Saheb Aftab Hussain", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Subodh Bhave", character: "Sadashiv", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Shankar Mahadevan", character: "Pandit Bhanu Shankar Shastri", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- HOLLYWOOD (Recent) --- */
    {
      id: 615685,
      title: "Oppenheimer",
      overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
      poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
      vote_average: 8.1,
      vote_count: 9100,
      release_date: "2023-07-19",
      genre_ids: [18, 36],
      runtime: 180,
      status: "Released",
      tagline: "The world forever changes.",
      budget: 100000000,
      revenue: 957000000,
      trailer_key: "uYPbbksJxIg",
      production_companies: [{ name: "Syncopy" }, { name: "Universal Pictures" }, { name: "Atlas Entertainment" }],
      credits: {
        cast: [
          { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 667538,
      title: "Barbie",
      overview: "Barbie land is fantastic until Stereotypical Barbie starts having a crisis that leads her and Ken on an unexpected journey into the real world.",
      poster_path: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.4,
      vote_count: 8500,
      release_date: "2023-07-21",
      genre_ids: [35, 36],
      runtime: 118,
      status: "Released",
      tagline: "She's everything. He's just Ken.",
      budget: 145000000,
      revenue: 1440000000,
      trailer_key: "pBk4NYhWNMM",
      production_companies: [{ name: "Warner Bros. Pictures" }],
      credits: {
        cast: [
          { name: "Margot Robbie", character: "Barbie", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Ryan Gosling", character: "Ken", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- TELUGU (South Indian) --- */
    {
      id: 721814,
      title: "RRR",
      overview: "Two legendary revolutionaries fight for independence from the British Raj in 1920s India.",
      poster_path: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.2,
      vote_count: 25000,
      release_date: "2022-03-24",
      genre_ids: [28, 12, 18],
      runtime: 187,
      status: "Released",
      tagline: "Friendship is a weapon.",
      budget: 400000000,
      revenue: 1300000000,
      trailer_key: "f_vbAtFSEc0",
      production_companies: [{ name: "DVV Entertainment" }],
      credits: {
        cast: [
          { name: "Jr. NTR", character: "Komaram Bheem", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Ram Charan", character: "Rama Raju", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 763419,
      title: "Pushpa: The Rise",
      overview: "A labourer smuggles red sandalwood from the Seshachalam hills and rises to the top of the hierarchy.",
      poster_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.6,
      vote_count: 14000,
      release_date: "2021-12-17",
      genre_ids: [28, 18],
      runtime: 179,
      status: "Released",
      tagline: "Pushpa, The Rise.",
      budget: 150000000,
      revenue: 360000000,
      trailer_key: "pKctjlpbqpQ",
      production_companies: [{ name: "Mythri Movie Makers" }],
      credits: {
        cast: [
          { name: "Allu Arjun", character: "Pushpa Raj", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Rashmika Mandanna", character: "Srivalli", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- TAMIL --- */
    {
      id: 828601,
      title: "Kantara",
      overview: "A village in Karnataka experiences unexplained events while a cop tries to solve the mystery of the missing people.",
      poster_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.2,
      vote_count: 16000,
      release_date: "2022-09-30",
      genre_ids: [28, 18, 9648],
      runtime: 144,
      status: "Released",
      tagline: "The forest has its own laws.",
      budget: 16000000,
      revenue: 400000000,
      trailer_key: "8mrVmf239GU",
      production_companies: [{ name: "Hombale Films" }],
      credits: {
        cast: [
          { name: "Rishab Shetty", character: "Vikrant Rona", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Sapthami Gowda", character: "Myna", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 692644,
      title: "Vikram Vedha",
      overview: "A cop and a gangster play a dangerous game of cat and mouse, each convinced they are the hero and the villain of the story.",
      poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.0,
      vote_count: 12000,
      release_date: "2017-09-28",
      genre_ids: [28, 18, 53],
      runtime: 138,
      status: "Released",
      tagline: "Truth vs. Justice.",
      budget: 6000000,
      revenue: 80000000,
      trailer_key: "1sNrC1o1bUU",
      production_companies: [{ name: "Y Not Studios" }],
      credits: {
        cast: [
          { name: "R. Madhavan", character: "Vikram", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Vijay Sethupathi", character: "Vedha", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- MALAYALAM --- */
    {
      id: 597135,
      title: "Drishyam",
      overview: "A man goes to great lengths to protect his family after they commit an unintentional crime.",
      poster_path: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.4,
      vote_count: 19000,
      release_date: "2013-10-06",
      genre_ids: [18, 53, 9648],
      runtime: 163,
      status: "Released",
      tagline: "The truth is in the details.",
      budget: 3500000,
      revenue: 50000000,
      trailer_key: "A_v6Z4u_T_k",
      production_companies: [{ name: "Aashirvad Cinemas" }],
      credits: {
        cast: [
          { name: "Mohanlal", character: "Georgekutty", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Meena", character: "Radha", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- PUNJABI --- */
    {
      id: 458,
      title: "Carry On Jatta",
      overview: "A hilarious comedy of errors surrounding a young man trying to hide his first marriage from his second love.",
      poster_path: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.8,
      vote_count: 8000,
      release_date: "2012-06-29",
      genre_ids: [35, 14],
      runtime: 135,
      status: "Released",
      tagline: "Laugh your heart out.",
      budget: 1000000,
      revenue: 25000000,
      trailer_key: "xGqT_g_y49c",
      production_companies: [{ name: "White Hill Films" }],
      credits: {
        cast: [
          { name: "Gippy Grewal", character: "Jaswinder Singh", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Patralekhaa", character: "Anita", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- BENGALI --- */
    {
      id: 299835,
      title: "Choker Bali",
      overview: "A deep exploration of relationships, desires, and societal norms through the lives of two women and the men in their lives.",
      poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.5,
      vote_count: 5000,
      release_date: "2000-10-06",
      genre_ids: [18, 10402],
      runtime: 140,
      status: "Released",
      tagline: "A classic tale of love and longing.",
      budget: 2000000,
      revenue: 8000000,
      trailer_key: "7r4s4nK9a3g",
      production_companies: [{ name: "Shree Venkatesh Films" }],
      credits: {
        cast: [
          { name: "Aparna Sen", character: "Binodini", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Prosenjit Chatterjee", character: "Mahendra", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- GUJARATI --- */
    {
      id: 346574,
      title: "Kavyann",
      overview: "A heartwarming story of a young couple navigating the complexities of modern relationships.",
      poster_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.2,
      vote_count: 3000,
      release_date: "2019-01-01",
      genre_ids: [18, 10402],
      runtime: 125,
      status: "Released",
      tagline: "Love in the time of chaos.",
      budget: 1500000,
      revenue: 6000000,
      trailer_key: "YoHD9XEInc0",
      production_companies: [{ name: "Rupam Entertainment" }],
      credits: {
        cast: [
          { name: "Monali Thakur", character: "Kavya", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
          { name: "Malhar Thakar", character: "Viraj", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- MARATHI MOVIES --- */
    {
      id: 395990,
      title: "Sairat",
      overview: "In rural Maharashtra, a fisherman's passionate son falls in love with the daughter of a powerful, wealthy politician, defying social barriers.",
      poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.3,
      vote_count: 14000,
      release_date: "2016-04-29",
      genre_ids: [18, 10749],
      runtime: 174,
      status: "Released",
      tagline: "Love without boundaries.",
      budget: 40000000,
      revenue: 1100000000,
      trailer_key: "Sairat_Trailer",
      production_companies: [{ name: "Zee Studios" }, { name: "Aatpat Production" }],
      credits: {
        cast: [
          { name: "Rinku Rajguru", character: "Archana Patil (Archie)", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Akash Thosar", character: "Prashant Kale (Parshya)", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 376288,
      title: "Natsamrat",
      overview: "A retired Shakespearean stage actor and his devoted wife face rejection, harsh realities, and heartbreak from their grown children.",
      poster_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.9,
      vote_count: 12000,
      release_date: "2016-01-01",
      genre_ids: [18],
      runtime: 166,
      status: "Released",
      tagline: "To be or not to be, that is the question.",
      budget: 90000000,
      revenue: 500000000,
      trailer_key: "Natsamrat_Trailer",
      production_companies: [{ name: "Fincraft Media & Entertainment" }],
      credits: {
        cast: [
          { name: "Nana Patekar", character: "Ganpat Belwalkar", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
          { name: "Medha Manjrekar", character: "Kaveri Belwalkar", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 367683,
      title: "Katyar Kaljat Ghusali",
      overview: "A clash of artistic egos and classical ragas erupts between two royal court singers in a duel for prestige.",
      poster_path: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.5,
      vote_count: 9500,
      release_date: "2015-11-12",
      genre_ids: [18, 10402],
      runtime: 162,
      status: "Released",
      tagline: "Music that pierces the soul.",
      budget: 80000000,
      revenue: 400000000,
      trailer_key: "Katyar_Trailer",
      production_companies: [{ name: "Zee Studios" }],
      credits: {
        cast: [
          { name: "Sachin Pilgaonkar", character: "Khansaheb Aftab Hussain Bareliwale", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Subodh Bhave", character: "Sadashiv", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 1148281,
      title: "Baipan Bhaari Deva",
      overview: "Six estranged sisters reunite to participate in a traditional Mangala Gaur dance competition, rediscovering their sisterhood.",
      poster_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.0,
      vote_count: 11000,
      release_date: "2023-06-30",
      genre_ids: [35, 18],
      runtime: 140,
      status: "Released",
      tagline: "Celebrate the spirit of womanhood.",
      budget: 50000000,
      revenue: 900000000,
      trailer_key: "Baipan_Trailer",
      production_companies: [{ name: "Jio Studios" }],
      credits: {
        cast: [
          { name: "Rohini Hattangadi", character: "Jaya", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80" },
          { name: "Vandana Gupte", character: "Shashi", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- TAMIL MOVIES --- */
    {
      id: 755566,
      title: "Vikram",
      overview: "A high-octane special black-ops squad led by Amar investigates a series of murders committed by a masked vigilante group.",
      poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80",
      vote_average: 8.3,
      vote_count: 22000,
      release_date: "2022-06-03",
      genre_ids: [28, 53, 80],
      runtime: 175,
      status: "Released",
      tagline: "Once upon a time, there lived a ghost.",
      budget: 1200000000,
      revenue: 4200000000,
      trailer_key: "Vikram_Tamil_Trailer",
      production_companies: [{ name: "Raaj Kamal Films International" }],
      credits: {
        cast: [
          { name: "Kamal Haasan", character: "Vikram / Karnan", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Vijay Sethupathi", character: "Santhanam", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Fahadh Faasil", character: "Amar", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 969492,
      title: "Leo",
      overview: "A calm animal rescuer and cafe owner in Himachal Pradesh becomes the target of ruthless gangsters who claim he is a feared kingpin.",
      poster_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.8,
      vote_count: 18000,
      release_date: "2023-10-19",
      genre_ids: [28, 80, 53],
      runtime: 164,
      status: "Released",
      tagline: "Bloody Sweet.",
      budget: 2500000000,
      revenue: 6200000000,
      trailer_key: "Leo_Trailer",
      production_companies: [{ name: "Seven Screen Studio" }],
      credits: {
        cast: [
          { name: "Thalapathy Vijay", character: "Parthiban / Leo Das", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
          { name: "Trisha Krishnan", character: "Sathya", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
          { name: "Sanjay Dutt", character: "Antony Das", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 987917,
      title: "Jailer",
      overview: "Muthuvel Pandian, a retired strict prison warden, comes out of retirement when an antique idol smuggling ring targets his family.",
      poster_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
      vote_average: 7.7,
      vote_count: 17000,
      release_date: "2023-08-10",
      genre_ids: [28, 80, 35],
      runtime: 168,
      status: "Released",
      tagline: "Tiger ka hukum.",
      budget: 2000000000,
      revenue: 6500000000,
      trailer_key: "Jailer_Trailer",
      production_companies: [{ name: "Sun Pictures" }],
      credits: {
        cast: [
          { name: "Rajinikanth", character: "Muthuvel Pandian", profile_path: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" },
          { name: "Vinayakan", character: "Varman", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },

    /* --- INTERNATIONAL --- */
    {
      id: 13,
      title: "Parasite",
      overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
      vote_average: 8.5,
      vote_count: 18000,
      release_date: "2019-05-30",
      genre_ids: [35, 53, 18],
      runtime: 132,
      status: "Released",
      tagline: "Act like you own the place.",
      budget: 11400000,
      revenue: 263136741,
      trailer_key: "5xH0RzeSojI",
      production_companies: [{ name: "Barunson E&A" }, { name: "CJ Entertainment" }],
      credits: {
        cast: [
          { name: "Song Kang-ho", character: "Kim Ki-taek", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Lee Sun-kyun", character: "Park Dong-ik", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    },
    {
      id: 634649,
      title: "Spider-Man: No Way Home",
      overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
      poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdrop_path: "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
      vote_average: 8.0,
      vote_count: 20000,
      release_date: "2021-12-15",
      genre_ids: [28, 12, 878],
      runtime: 148,
      status: "Released",
      tagline: "The Multiverse Unleashed.",
      budget: 200000000,
      revenue: 1921847111,
      trailer_key: "JfVOs4VSpmA",
      production_companies: [{ name: "Marvel Studios" }, { name: "Columbia Pictures" }, { name: "Pascal Pictures" }],
      credits: {
        cast: [
          { name: "Tom Holland", character: "Peter Parker / Spider-Man", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
          { name: "Zendaya", character: "MJ", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" }
        ]
      }
    }
  ]
};