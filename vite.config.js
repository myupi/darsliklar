import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Уроки импортируют платформу как '@lesson/runtime'. В просмотрщике её
    // заменяет локальная эмуляция из src/runtime.
    alias: { '@lesson/runtime': r('./src/runtime/index.js') },
  },
  server: { port: 5173 },
  build: {
    // Файлы уроков большие (до 600 КБ) — это нормально, не предупреждаем.
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: { main: r('./index.html'), player: r('./player.html') },
    },
  },
});
