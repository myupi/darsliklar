import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import ttsService from './tools/vite-tts-service.mjs';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // ttsService — сервис озвучки для уроков, которые говорят по ttsApiBase.
  plugins: [react(), ttsService()],
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
      // demo-mir — проба «живого мира» урока 17 (заказчик открывает её на Vercel по тому же пути).
      input: { main: r('./index.html'), player: r('./player.html'), 'demo-mir': r('./tools/problemitas17/demo/mir.html'),
        'demo-zhivoy': r('./tools/problemitas17/demo/zhivoy.html') },
    },
  },
});
