import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/rifokatsubook/',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist-build',
    rollupOptions: {
      input: {
        main: 'index.html',
        articles: 'articles.html',
        article: 'article.html',
      },
    },
  },
});
