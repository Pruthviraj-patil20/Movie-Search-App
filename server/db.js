/**
 * CineSphere Multi-User Database Layer
 * Relational schema with atomic persistence, multi-user isolation, and indexing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'cinesphere_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Schema
const DEFAULT_SCHEMA = {
  users: [],
  watchlist: [],
  favorites: [],
  watched_movies: [],
  recently_viewed: [],
  movie_ratings: [],
  search_history: [],
  user_preferences: []
};

class Database {
  constructor() {
    this.data = { ...DEFAULT_SCHEMA };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = { ...DEFAULT_SCHEMA, ...JSON.parse(raw) };
      } else {
        this.save();
      }
    } catch (e) {
      console.error('[DB] Error loading database, initializing default schema:', e);
      this.data = { ...DEFAULT_SCHEMA };
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error('[DB] Error persisting database:', e);
    }
  }

  generateId() {
    return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  }

  // --- USERS TABLE ---
  createUser(userData) {
    const now = new Date().toISOString();
    const newUser = {
      id: this.generateId(),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      profileImage: userData.profileImage || null,
      phone: userData.phone || '',
      country: userData.country || '',
      bio: userData.bio || '',
      emailVerified: Boolean(userData.emailVerified),
      verificationToken: userData.verificationToken || null,
      resetToken: null,
      resetTokenExpires: null,
      createdAt: now,
      updatedAt: now
    };

    this.data.users.push(newUser);

    // Initialize default preferences
    this.data.user_preferences.push({
      id: this.generateId(),
      userId: newUser.id,
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        recommendations: true,
        watchlistReminders: true,
        updates: false
      }
    });

    this.save();
    return this.sanitizeUser(newUser);
  }

  findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    return this.data.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  findUserById(id) {
    if (!id) return null;
    return this.data.users.find(u => u.id === id) || null;
  }

  findUserByResetToken(token) {
    if (!token) return null;
    const now = new Date().toISOString();
    return this.data.users.find(u => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > now) || null;
  }

  findUserByVerificationToken(token) {
    if (!token) return null;
    return this.data.users.find(u => u.verificationToken === token) || null;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return this.sanitizeUser(user);
  }

  deleteUser(id) {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    // Cascade delete all user-owned records
    this.data.watchlist = this.data.watchlist.filter(item => item.userId !== id);
    this.data.favorites = this.data.favorites.filter(item => item.userId !== id);
    this.data.watched_movies = this.data.watched_movies.filter(item => item.userId !== id);
    this.data.recently_viewed = this.data.recently_viewed.filter(item => item.userId !== id);
    this.data.movie_ratings = this.data.movie_ratings.filter(item => item.userId !== id);
    this.data.search_history = this.data.search_history.filter(item => item.userId !== id);
    this.data.user_preferences = this.data.user_preferences.filter(item => item.userId !== id);

    this.save();
    return this.data.users.length < initialLen;
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { passwordHash, resetToken, resetTokenExpires, verificationToken, ...safeUser } = user;
    return safeUser;
  }

  // --- USER PREFERENCES ---
  getUserPreferences(userId) {
    let pref = this.data.user_preferences.find(p => p.userId === userId);
    if (!pref) {
      pref = {
        id: this.generateId(),
        userId,
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          recommendations: true,
          watchlistReminders: true,
          updates: false
        }
      };
      this.data.user_preferences.push(pref);
      this.save();
    }
    return pref;
  }

  updateUserPreferences(userId, updates) {
    const pref = this.getUserPreferences(userId);
    if (updates.theme) pref.theme = updates.theme;
    if (updates.language) pref.language = updates.language;
    if (updates.notifications) {
      pref.notifications = { ...pref.notifications, ...updates.notifications };
    }
    this.save();
    return pref;
  }

  // --- WATCHLIST (Scoped by userId) ---
  getWatchlist(userId) {
    return this.data.watchlist.filter(w => w.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  isInWatchlist(userId, movieId) {
    const numId = Number(movieId);
    return this.data.watchlist.some(w => w.userId === userId && Number(w.movieId) === numId);
  }

  addToWatchlist(userId, movie) {
    const numId = Number(movie.id);
    if (this.isInWatchlist(userId, numId)) return false;

    const entry = {
      id: this.generateId(),
      userId,
      movieId: numId,
      movieData: {
        id: numId,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || movie.first_air_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
      },
      createdAt: new Date().toISOString()
    };

    this.data.watchlist.push(entry);
    this.save();
    return entry;
  }

  removeFromWatchlist(userId, movieId) {
    const numId = Number(movieId);
    const before = this.data.watchlist.length;
    this.data.watchlist = this.data.watchlist.filter(w => !(w.userId === userId && Number(w.movieId) === numId));
    this.save();
    return this.data.watchlist.length < before;
  }

  clearWatchlist(userId) {
    this.data.watchlist = this.data.watchlist.filter(w => w.userId !== userId);
    this.save();
    return true;
  }

  // --- FAVORITES (Scoped by userId) ---
  getFavorites(userId) {
    return this.data.favorites.filter(f => f.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  isFavorite(userId, movieId) {
    const numId = Number(movieId);
    return this.data.favorites.some(f => f.userId === userId && Number(f.movieId) === numId);
  }

  addToFavorites(userId, movie) {
    const numId = Number(movie.id);
    if (this.isFavorite(userId, numId)) return false;

    const entry = {
      id: this.generateId(),
      userId,
      movieId: numId,
      movieData: {
        id: numId,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || movie.first_air_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
      },
      createdAt: new Date().toISOString()
    };

    this.data.favorites.push(entry);
    this.save();
    return entry;
  }

  removeFromFavorites(userId, movieId) {
    const numId = Number(movieId);
    const before = this.data.favorites.length;
    this.data.favorites = this.data.favorites.filter(f => !(f.userId === userId && Number(f.movieId) === numId));
    this.save();
    return this.data.favorites.length < before;
  }

  clearFavorites(userId) {
    this.data.favorites = this.data.favorites.filter(f => f.userId !== userId);
    this.save();
    return true;
  }

  // --- WATCHED MOVIES (Scoped by userId) ---
  getWatchedMovies(userId) {
    return this.data.watched_movies.filter(w => w.userId === userId).sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  }

  isWatched(userId, movieId) {
    const numId = Number(movieId);
    return this.data.watched_movies.some(w => w.userId === userId && Number(w.movieId) === numId);
  }

  markAsWatched(userId, movie) {
    const numId = Number(movie.id);
    const existing = this.data.watched_movies.find(w => w.userId === userId && Number(w.movieId) === numId);
    const now = new Date().toISOString();

    if (existing) {
      existing.watchedAt = now;
      this.save();
      return existing;
    }

    const entry = {
      id: this.generateId(),
      userId,
      movieId: numId,
      movieData: {
        id: numId,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
      },
      watchedAt: now
    };

    this.data.watched_movies.push(entry);
    this.save();
    return entry;
  }

  removeFromWatched(userId, movieId) {
    const numId = Number(movieId);
    const before = this.data.watched_movies.length;
    this.data.watched_movies = this.data.watched_movies.filter(w => !(w.userId === userId && Number(w.movieId) === numId));
    this.save();
    return this.data.watched_movies.length < before;
  }

  clearWatched(userId) {
    this.data.watched_movies = this.data.watched_movies.filter(w => w.userId !== userId);
    this.save();
    return true;
  }

  // --- RECENTLY VIEWED (Scoped by userId) ---
  getRecentlyViewed(userId, limit = 15) {
    return this.data.recently_viewed
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .slice(0, limit);
  }

  addRecentlyViewed(userId, movie) {
    const numId = Number(movie.id);
    const now = new Date().toISOString();

    // Filter out existing to bump to top
    this.data.recently_viewed = this.data.recently_viewed.filter(
      r => !(r.userId === userId && Number(r.movieId) === numId)
    );

    const entry = {
      id: this.generateId(),
      userId,
      movieId: numId,
      movieData: {
        id: numId,
        title: movie.title || movie.name || 'Untitled',
        poster_path: movie.poster_path || '',
        backdrop_path: movie.backdrop_path || '',
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || '',
        genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
      },
      viewedAt: now
    };

    this.data.recently_viewed.unshift(entry);

    // Limit to max 30 per user
    const userItems = this.data.recently_viewed.filter(r => r.userId === userId);
    if (userItems.length > 30) {
      const idsToKeep = new Set(userItems.slice(0, 30).map(item => item.id));
      this.data.recently_viewed = this.data.recently_viewed.filter(
        r => r.userId !== userId || idsToKeep.has(r.id)
      );
    }

    this.save();
    return entry;
  }

  removeRecentlyViewed(userId, movieId) {
    const numId = Number(movieId);
    this.data.recently_viewed = this.data.recently_viewed.filter(
      r => !(r.userId === userId && Number(r.movieId) === numId)
    );
    this.save();
    return true;
  }

  clearRecentlyViewed(userId) {
    this.data.recently_viewed = this.data.recently_viewed.filter(r => r.userId !== userId);
    this.save();
    return true;
  }

  // --- MOVIE RATINGS (Scoped by userId) ---
  getMovieRatings(userId) {
    return this.data.movie_ratings.filter(r => r.userId === userId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  getUserMovieRating(userId, movieId) {
    const numId = Number(movieId);
    return this.data.movie_ratings.find(r => r.userId === userId && Number(r.movieId) === numId) || null;
  }

  rateMovie(userId, movieId, rating, movieData = {}) {
    const numId = Number(movieId);
    const numRating = Math.max(1, Math.min(10, Number(rating)));
    const now = new Date().toISOString();

    let existing = this.data.movie_ratings.find(r => r.userId === userId && Number(r.movieId) === numId);

    if (existing) {
      existing.rating = numRating;
      existing.updatedAt = now;
      if (movieData && movieData.title) existing.movieData = movieData;
      this.save();
      return existing;
    }

    const entry = {
      id: this.generateId(),
      userId,
      movieId: numId,
      rating: numRating,
      movieData: {
        id: numId,
        title: movieData.title || 'Movie',
        poster_path: movieData.poster_path || '',
        release_date: movieData.release_date || '',
        genre_ids: movieData.genre_ids || []
      },
      createdAt: now,
      updatedAt: now
    };

    this.data.movie_ratings.push(entry);
    this.save();
    return entry;
  }

  removeRating(userId, movieId) {
    const numId = Number(movieId);
    const before = this.data.movie_ratings.length;
    this.data.movie_ratings = this.data.movie_ratings.filter(r => !(r.userId === userId && Number(r.movieId) === numId));
    this.save();
    return this.data.movie_ratings.length < before;
  }

  // --- SEARCH HISTORY (Scoped by userId) ---
  getSearchHistory(userId, limit = 10) {
    return this.data.search_history
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt))
      .slice(0, limit);
  }

  addSearchHistory(userId, query) {
    const clean = query.trim();
    if (!clean || clean.length < 2) return null;

    // Filter existing duplicates
    this.data.search_history = this.data.search_history.filter(
      s => !(s.userId === userId && s.query.toLowerCase() === clean.toLowerCase())
    );

    const entry = {
      id: this.generateId(),
      userId,
      query: clean,
      searchedAt: new Date().toISOString()
    };

    this.data.search_history.unshift(entry);

    // Limit to 20
    const userHistory = this.data.search_history.filter(s => s.userId === userId);
    if (userHistory.length > 20) {
      const idsToKeep = new Set(userHistory.slice(0, 20).map(h => h.id));
      this.data.search_history = this.data.search_history.filter(
        s => s.userId !== userId || idsToKeep.has(s.id)
      );
    }

    this.save();
    return entry;
  }

  removeSearchHistory(userId, query) {
    this.data.search_history = this.data.search_history.filter(
      s => !(s.userId === userId && s.query.toLowerCase() === query.toLowerCase().trim())
    );
    this.save();
    return true;
  }

  clearSearchHistory(userId) {
    this.data.search_history = this.data.search_history.filter(s => s.userId !== userId);
    this.save();
    return true;
  }

  // --- USER ANALYTICS CALCULATOR ---
  getUserAnalytics(userId) {
    const watched = this.getWatchedMovies(userId);
    const favorites = this.getFavorites(userId);
    const watchlist = this.getWatchlist(userId);
    const ratings = this.getMovieRatings(userId);

    // Calculate Genre Breakdown from watched, favorites, and ratings
    const genreCount = {};
    const countGenres = (items) => {
      items.forEach(item => {
        const m = item.movieData || item;
        const genres = m.genre_ids || (m.genres ? m.genres.map(g => g.id) : []);
        genres.forEach(gid => {
          genreCount[gid] = (genreCount[gid] || 0) + 1;
        });
      });
    };

    countGenres(watched);
    countGenres(favorites);
    countGenres(watchlist);

    // Average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = Number((sum / ratings.length).toFixed(1));
    }

    return {
      totalWatched: watched.length,
      totalFavorites: favorites.length,
      totalWatchlist: watchlist.length,
      totalRatings: ratings.length,
      averageRating: avgRating,
      genreCounts: genreCount,
      recentWatched: watched.slice(0, 5),
      recentRatings: ratings.slice(0, 5)
    };
  }
}

export const db = new Database();
