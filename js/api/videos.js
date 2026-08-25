/**
 * TMDB Video & Trailer API Module
 * Provides YouTube trailer discovery with zero-failure local fallback registry and search fallbacks
 */

import { tmdbFetch } from './tmdb.js';
import { CONFIG } from '../config.js';

// Curated Registry of verified YouTube trailer keys for popular and catalog titles
const CURATED_TRAILERS = {
  // Movie IDs
  27205: 'YoHD9XEInc0',   // Inception
  157336: 'zSWdZVtXT7E',  // Interstellar
  155: 'EXeTwQWrcwY',     // The Dark Knight
  693134: 'Way9Dexny3w',  // Dune: Part Two
  872585: 'uYPbbksJxIg',  // Oppenheimer
  569094: 'cqGjhVJWtEg',  // Spider-Man: Across the Spider-Verse
  76600: 'd9MyW72ELq0',   // Avatar: The Way of Water
  361743: 'giXco2jaZ_4',  // Top Gun: Maverick
  278: 'PLl99DlL6b4',     // The Shawshank Redemption
  680: 's7EdQ4FqbhY',     // Pulp Fiction
  550: 'O1nDozs-96U',     // Fight Club
  603: 'vKQi3bBA1y8',     // The Matrix
  98: 'P5ieIbInFpg',      // Gladiator
  299534: 'TcMBFSGVi1c',  // Avengers: Endgame
  496243: '5xH0RzeSojI',  // Parasite
  244786: '7d_jQycdQGo',  // Whiplash
  335984: 'gCcx85zbxz4',  // Blade Runner 2049
  634649: 'JfVOs4VSpmA',  // Spider-Man: No Way Home
  414906: 'mqqft2x_Aa4',  // The Batman
  603692: 'qEVUtrk8_B4',  // John Wick: Chapter 4
  507089: '0VH9WCFV6XQ',  // Five Nights at Freddy's
  575264: 'shW9i6k8cB0',  // Mission: Impossible - Dead Reckoning
  385687: 'odM92ap8_c0',  // Fast X
  934433: 'bK6ldnjMO61',  // Scream VI
  677179: 'jPRz2qX4Jk4',  // Creed III
  346698: 'pBk4NYhWNMM',  // Barbie
  // Bollywood & Hindi Classics
  975069: 'x_7YlGv9u1g',  // Dangal
  360814: 'x_7YlGv9u1g',  // Dangal
  20453: 'xvszmNXdM4w',   // 3 Idiots
  10839: 'qL3XQk7w7H8',   // Sholay
  111101: 'qL3XQk7w7H8',  // Sholay
  1966: 'oSIGJ347Jsw',    // Lagaan
  111102: 'oSIGJ347Jsw',  // Lagaan
  19404: 'c25GKl5VNeY',   // Dilwale Dulhania Le Jayenge
  111107: 'c25GKl5VNeY',  // DDLJ
  872906: 'MWOlnZSnXWE',  // Jawan
  864692: 'vqu4zBiMX4k',  // Pathaan
  297222: 'SOXw33Oamyw',  // PK
  111105: 'SOXw33Oamyw',  // PK
  74534: 'FJrpcDgC3zU',   // ZNMD
  111106: 'FJrpcDgC3zU',  // ZNMD
  7508: 'tn_2Ie_jtNY',    // Taare Zameen Par
  111103: 'tn_2Ie_jtNY',  // Taare Zameen Par
  534780: '2iVYI99VGaw',  // Andhadhun
  111104: '2iVYI99VGaw',  // Andhadhun
  84175: 'j-KEb1ePffQ',   // Gangs of Wasseypur
  111108: 'j-KEb1ePffQ',  // Gangs of Wasseypur
  15478: 'NC7GY_ZfH7Y',   // Swades
  111109: 'NC7GY_ZfH7Y',  // Swades
  348892: '4nwAra0mz_Q',  // Bajrangi Bhaijaan
  15501: '4nwAra0mz_Q',   // Bajrangi Bhaijaan
  346428: 'rRr1QIoxnGQ',  // Sanju
  181498: 'X_5_BLtZx6c',  // Padmaavat
  493529: 'V5Z7ycT_6m0',  // Brahmastra
  9819: 'b5pYgSg31Yg',    // Devdas
  111110: 'b5pYgSg31Yg'   // Devdas
};

// Title-based fallback normalized lookup
const TITLE_TRAILERS = {
  'spider-man: no way home': 'JfVOs4VSpmA',
  'spiderman no way home': 'JfVOs4VSpmA',
  'spider-man across the spider-verse': 'cqGjhVJWtEg',
  'inception': 'YoHD9XEInc0',
  'interstellar': 'zSWdZVtXT7E',
  'the dark knight': 'EXeTwQWrcwY',
  'dune: part two': 'Way9Dexny3w',
  'dune part two': 'Way9Dexny3w',
  'oppenheimer': 'uYPbbksJxIg',
  'avatar: the way of water': 'd9MyW72ELq0',
  'top gun: maverick': 'giXco2jaZ_4',
  'the shawshank redemption': 'PLl99DlL6b4',
  'pulp fiction': 's7EdQ4FqbhY',
  'fight club': 'O1nDozs-96U',
  'the matrix': 'vKQi3bBA1y8',
  'gladiator': 'P5ieIbInFpg',
  'avengers: endgame': 'TcMBFSGVi1c',
  'parasite': '5xH0RzeSojI',
  'whiplash': '7d_jQycdQGo',
  'blade runner 2049': 'gCcx85zbxz4',
  'the batman': 'mqqft2x_Aa4',
  'john wick: chapter 4': 'qEVUtrk8_B4',
  'barbie': 'pBk4NYhWNMM',
  // Bollywood Titles
  'dangal': 'x_7YlGv9u1g',
  '3 idiots': 'xvszmNXdM4w',
  'sholay': 'qL3XQk7w7H8',
  'lagaan': 'oSIGJ347Jsw',
  'lagaan: once upon a time in india': 'oSIGJ347Jsw',
  'dilwale dulhania le jayenge': 'c25GKl5VNeY',
  'ddlj': 'c25GKl5VNeY',
  'jawan': 'MWOlnZSnXWE',
  'pathaan': 'vqu4zBiMX4k',
  'pk': 'SOXw33Oamyw',
  'zindagi na milegi dobara': 'FJrpcDgC3zU',
  'taare zameen par': 'tn_2Ie_jtNY',
  'andhadhun': '2iVYI99VGaw',
  'gangs of wasseypur': 'j-KEb1ePffQ',
  'swades': 'NC7GY_ZfH7Y',
  'bajrangi bhaijaan': '4nwAra0mz_Q',
  'sanju': 'rRr1QIoxnGQ',
  'padmaavat': 'X_5_BLtZx6c',
  'brahmāstra: part one – shiva': 'V5Z7ycT_6m0',
  'brahmastra': 'V5Z7ycT_6m0',
  'devdas': 'b5pYgSg31Yg'
};

/**
 * Fetch all video clips for a movie
 */
export async function getMovieVideos(movieId) {
  if (!movieId) return [];
  try {
    const data = await tmdbFetch(`/movie/${movieId}/videos`, {}, {
      fallback: { results: [] }
    });
    
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data.results;
    }
  } catch (error) {
    // Graceful fallback to demo data
  }

  // Check demo catalog and curated registry
  const numId = Number(movieId);
  const demo = (CONFIG.DEMO_MOVIES || []).find(m => m.id === numId);
  const trailerKey = demo?.trailer_key || CURATED_TRAILERS[numId];

  if (trailerKey) {
    return [
      {
        key: trailerKey,
        site: 'YouTube',
        type: 'Trailer',
        official: true,
        name: `${demo?.title || 'Official'} Trailer`
      }
    ];
  }

  return [];
}

/**
 * Find best YouTube trailer key for a movie with smart fallbacks
 */
export async function getMovieTrailer(movieId, movieTitle = '') {
  let youtubeVideos = [];
  
  if (movieId) {
    const videos = await getMovieVideos(movieId);
    if (videos && videos.length > 0) {
      youtubeVideos = videos.filter(v => v.site === 'YouTube');
    }
  }

  // Priority 1: Official Trailer
  const officialTrailer = youtubeVideos.find(
    v => v.type === 'Trailer' && v.official === true
  );
  if (officialTrailer && officialTrailer.key) return officialTrailer;

  // Priority 2: Any Trailer
  const anyTrailer = youtubeVideos.find(v => v.type === 'Trailer');
  if (anyTrailer && anyTrailer.key) return anyTrailer;

  // Priority 3: Teaser
  const teaser = youtubeVideos.find(v => v.type === 'Teaser');
  if (teaser && teaser.key) return teaser;

  // Priority 4: Clip or Featurette
  if (youtubeVideos.length > 0 && youtubeVideos[0].key) {
    return youtubeVideos[0];
  }

  // Priority 5: Curated ID match (number ID from TMDB)
  const numId = Number(movieId);
  if (CURATED_TRAILERS[numId]) {
    return {
      key: CURATED_TRAILERS[numId],
      site: 'YouTube',
      type: 'Trailer',
      official: true
    };
  }

  // Priority 6: Title match (normalized lookup)
  if (movieTitle) {
    const cleanTitle = (movieTitle || '').toLowerCase().trim();
    if (TITLE_TRAILERS[cleanTitle]) {
      return {
        key: TITLE_TRAILERS[cleanTitle],
        site: 'YouTube',
        type: 'Trailer',
        official: true
      };
    }
  }

  // Priority 7: YouTube Search List Query Fallback
  if (movieTitle) {
    return {
      key: null,
      searchQuery: `${movieTitle} Official Trailer`,
      site: 'YouTube',
      type: 'Trailer',
      official: true
    };
  }

  return null;
}
