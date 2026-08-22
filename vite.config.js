import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        search: 'search.html',
        movie: 'movie.html',
        watchlist: 'watchlist.html',
        favorites: 'favorites.html',
        dashboard: 'dashboard.html',
        profile: 'profile.html',
        settings: 'settings.html',
        login: 'login.html',
        signup: 'signup.html',
        forgotPassword: 'forgot-password.html',
        resetPassword: 'reset-password.html',
        verifyEmail: 'verify-email.html',
        notFound: '404.html'
      }
    }
  }
});