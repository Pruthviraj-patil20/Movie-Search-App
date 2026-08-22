/**
 * CineSphere Configuration Module
 * Manages environment variables, TMDB endpoints, and image resolutions
 */

const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

export const CONFIG = {
  API_KEY: env.VITE_TMDB_API_KEY || 'c3590dc2e74e64f89d316cb6beafbc60',
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
      genre_ids: [28, 878, 12]
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
      genre_ids: [12, 18, 878]
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
      genre_ids: [18, 28, 80, 53]
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
      genre_ids: [878, 12]
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
      genre_ids: [18, 36]
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
      genre_ids: [16, 28, 12, 878]
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
      genre_ids: [878, 12, 28]
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
      genre_ids: [28, 18]
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
      genre_ids: [18, 80]
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
      genre_ids: [53, 80]
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
      genre_ids: [18]
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
      genre_ids: [28, 878]
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
      genre_ids: [28, 18, 12]
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
      genre_ids: [12, 878, 28]
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
      genre_ids: [35, 53, 18]
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
      genre_ids: [18, 10402]
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
      genre_ids: [878, 18]
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
      genre_ids: [28, 12, 878]
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
      genre_ids: [80, 9648, 53]
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
      genre_ids: [28, 53, 80]
    }
  ]
};