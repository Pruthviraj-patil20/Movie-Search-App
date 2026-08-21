/**
 * User Movie Data Routes
 * /api/user-movies
 * Scoped strictly to authenticated user's ID
 */

import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAuth to all routes in this router
router.use(requireAuth);

// ==========================================
// WATCHLIST
// ==========================================

router.get('/watchlist', (req, res) => {
  const list = db.getWatchlist(req.user.id);
  res.json({ success: true, count: list.length, data: list.map(item => item.movieData) });
});

router.post('/watchlist', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) {
    return res.status(400).json({ success: false, error: 'Valid movie object with id is required' });
  }

  const added = db.addToWatchlist(req.user.id, movie);
  if (!added) {
    return res.status(200).json({ success: true, message: 'Movie already in watchlist', inWatchlist: true });
  }

  res.status(201).json({
    success: true,
    message: 'Movie added to watchlist',
    inWatchlist: true,
    count: db.getWatchlist(req.user.id).length
  });
});

router.delete('/watchlist/:movieId', (req, res) => {
  const removed = db.removeFromWatchlist(req.user.id, req.params.movieId);
  res.json({
    success: true,
    message: removed ? 'Movie removed from watchlist' : 'Movie not in watchlist',
    inWatchlist: false,
    count: db.getWatchlist(req.user.id).length
  });
});

router.delete('/watchlist', (req, res) => {
  db.clearWatchlist(req.user.id);
  res.json({ success: true, message: 'Watchlist cleared', count: 0 });
});

// ==========================================
// FAVORITES
// ==========================================

router.get('/favorites', (req, res) => {
  const list = db.getFavorites(req.user.id);
  res.json({ success: true, count: list.length, data: list.map(item => item.movieData) });
});

router.post('/favorites', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) {
    return res.status(400).json({ success: false, error: 'Valid movie object with id is required' });
  }

  const added = db.addToFavorites(req.user.id, movie);
  if (!added) {
    return res.status(200).json({ success: true, message: 'Movie already in favorites', isFavorite: true });
  }

  res.status(201).json({
    success: true,
    message: 'Movie added to favorites',
    isFavorite: true,
    count: db.getFavorites(req.user.id).length
  });
});

router.delete('/favorites/:movieId', (req, res) => {
  const removed = db.removeFromFavorites(req.user.id, req.params.movieId);
  res.json({
    success: true,
    message: removed ? 'Movie removed from favorites' : 'Movie not in favorites',
    isFavorite: false,
    count: db.getFavorites(req.user.id).length
  });
});

router.delete('/favorites', (req, res) => {
  db.clearFavorites(req.user.id);
  res.json({ success: true, message: 'Favorites cleared', count: 0 });
});

// ==========================================
// WATCHED MOVIES
// ==========================================

router.get('/watched', (req, res) => {
  const list = db.getWatchedMovies(req.user.id);
  res.json({ success: true, count: list.length, data: list.map(item => item.movieData) });
});

router.post('/watched', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) {
    return res.status(400).json({ success: false, error: 'Valid movie object is required' });
  }

  db.markAsWatched(req.user.id, movie);
  res.json({
    success: true,
    message: 'Movie marked as watched',
    isWatched: true,
    count: db.getWatchedMovies(req.user.id).length
  });
});

router.delete('/watched/:movieId', (req, res) => {
  db.removeFromWatched(req.user.id, req.params.movieId);
  res.json({
    success: true,
    message: 'Movie removed from watched history',
    isWatched: false,
    count: db.getWatchedMovies(req.user.id).length
  });
});

router.delete('/watched', (req, res) => {
  db.clearWatched(req.user.id);
  res.json({ success: true, message: 'Watch history cleared', count: 0 });
});

// ==========================================
// RECENTLY VIEWED
// ==========================================

router.get('/recent', (req, res) => {
  const list = db.getRecentlyViewed(req.user.id, 20);
  res.json({ success: true, data: list.map(item => item.movieData) });
});

router.post('/recent', (req, res) => {
  const { movie } = req.body;
  if (!movie || !movie.id) {
    return res.status(400).json({ success: false, error: 'Valid movie object is required' });
  }

  db.addRecentlyViewed(req.user.id, movie);
  res.json({ success: true });
});

router.delete('/recent/:movieId', (req, res) => {
  db.removeRecentlyViewed(req.user.id, req.params.movieId);
  res.json({ success: true, message: 'Movie removed from recent history' });
});

router.delete('/recent', (req, res) => {
  db.clearRecentlyViewed(req.user.id);
  res.json({ success: true, message: 'Recently viewed history cleared' });
});

// ==========================================
// MOVIE RATINGS
// ==========================================

router.get('/ratings', (req, res) => {
  const list = db.getMovieRatings(req.user.id);
  res.json({ success: true, count: list.length, data: list });
});

router.get('/ratings/:movieId', (req, res) => {
  const rating = db.getUserMovieRating(req.user.id, req.params.movieId);
  res.json({ success: true, rating: rating ? rating.rating : null });
});

router.post('/ratings', (req, res) => {
  const { movieId, rating, movieData } = req.body;
  if (!movieId || rating === undefined) {
    return res.status(400).json({ success: false, error: 'movieId and rating (1-10) are required' });
  }

  const saved = db.rateMovie(req.user.id, movieId, rating, movieData);
  res.json({
    success: true,
    message: `Movie rated ${saved.rating}/10`,
    rating: saved.rating
  });
});

router.delete('/ratings/:movieId', (req, res) => {
  db.removeRating(req.user.id, req.params.movieId);
  res.json({ success: true, message: 'Rating removed', rating: null });
});

// ==========================================
// SEARCH HISTORY
// ==========================================

router.get('/search-history', (req, res) => {
  const history = db.getSearchHistory(req.user.id);
  res.json({ success: true, data: history.map(h => h.query) });
});

router.post('/search-history', (req, res) => {
  const { query } = req.body;
  if (query) {
    db.addSearchHistory(req.user.id, query);
  }
  res.json({ success: true });
});

router.delete('/search-history/:query', (req, res) => {
  db.removeSearchHistory(req.user.id, req.params.query);
  res.json({ success: true });
});

router.delete('/search-history', (req, res) => {
  db.clearSearchHistory(req.user.id);
  res.json({ success: true, message: 'Search history cleared' });
});

export default router;
