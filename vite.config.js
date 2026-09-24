import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Статический сайт: собранная папка dist/ кладётся на любой хостинг как есть.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  preview: { port: 5180 },
  build: { outDir: 'dist', emptyOutDir: true },
});
