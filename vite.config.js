import { defineConfig } from 'vite';
import { cpSync, readdirSync } from 'node:fs';

const articleInputs = Object.fromEntries(
  readdirSync('articles', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [`article-${entry.name}`, `articles/${entry.name}/index.html`]),
);

export default defineConfig({
  root: '.',
  base: '/rifokatsubook/',
  plugins: [
    {
      name: 'copy-stable-images',
      writeBundle() {
        cpSync('images', 'dist-build/images', { recursive: true });
      },
    },
  ],
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
        privacy: 'privacy.html',
        notFound: '404.html',
        ...articleInputs,
      },
    },
  },
});
