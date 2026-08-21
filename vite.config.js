import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        search: resolve(__dirname, 'search.html'),
        movie: resolve(__dirname, 'movie.html'),
        watchlist: resolve(__dirname, 'watchlist.html'),
        favorites: resolve(__dirname, 'favorites.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
